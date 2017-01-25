//myviz.component.js
angular
  .module('dap.viz')
  .component("myviz", {
    controller: MyVizController,
    templateUrl: 'app/visualizations/myviz.html'
  });

MyVizController.$inject = ['vizApi', 'utilService', '$rootRouter', '$mdDialog', 'authService', 'vizConstants', '$scope', 'auditService', '$timeout'];

function MyVizController(vizApi, utilService, $rootRouter, $mdDialog, authService, vizConstants, $scope, auditService, $timeout) {
  var
    ctrl = this,
    searchState = null,
    sortState = 'updatedDate desc';

  ctrl.selectedItem = null;
  ctrl.selectedFolder = null;
  ctrl.baseUrl = vizConstants.BASE_URL;
  ctrl.showNotes = true;
  ctrl.isAdmin = false;
  ctrl.isCreator = false;
  ctrl.visuals = null;
  ctrl.sortFields = [{ value: 'updatedDate desc', name: 'Last Change' },
  { value: 'name asc', name: 'Name (A-Z)' },
  { value: 'name desc', name: 'Name (Z-A)' }];

  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.filter = filter;
  ctrl.selectFolder = selectFolder;
  ctrl.navigate = navigate;
  ctrl.edit = edit;
  ctrl.remove = remove;
  ctrl.share = share;
  ctrl.showCustomColor = showCustomColor;
  ctrl.sort = sort;

  //events
  $scope.$on('DAP.VIZ.REFRESH', function (event, args) {
    bind(true);
  });


  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize();

    if (authService.isInRole(authService.roles.visuals_admin)) {
      ctrl.isAdmin = true;
      ctrl.isCreator = true;
    }
    else if (authService.isInRole(authService.roles.visuals_creator)) {
      ctrl.isCreator = true;
    }

    bind();

    //audit
    auditService.add(auditService.assets['Visualizations Library'], null, auditService.actions.View)
  }

  function bind(cacheRefresh) {
    ctrl.visuals = null;
    ctrl.folders = null;

    vizApi[(ctrl.isAdmin) ? 'getAll' : 'get'](cacheRefresh).then(function (response) {
      ctrl.visuals = _.filter(utilService.filterArray(response.data.data.visuals || [], ['name', 'tags'], searchState, sortState), ['folder', ctrl.selectedFolder]);
      ctrl.folders = utilService.filterArray(response.data.data.folders || [], ['name'], searchState, sortState);
    }, function (error) {
      ctrl.visuals = [];
      ctrl.folders = [];
    });
  }

  function filter(search) {
    searchState = search;
    bind();
  }

  function selectFolder(name) {
    if (ctrl.selectedFolder !== null || name !== null) {
      ctrl.visuals = null;
      $timeout(function () {
        ctrl.selectedFolder = name;
        bind();
      });
    }
  }

  function navigate(comp, id) {
    if (id)
      $rootRouter.navigate([comp, { id: id }]);
    else
      $rootRouter.navigate([comp]);
  }

  function edit(item, e) {
    utilService.setObj(item);

    $mdDialog.show({
      parent: angular.element(document.body),
      template: '<md-dialog flex="70"><dap-manage-viz></dap-manage-viz></md-dialog>',
      targetEvent: e,
      fullscreen: true
    });
  }

  function remove(item, e) {
    $mdDialog.show(utilService.deleteConfirmDialog('Delete Visual', 'Are you sure you want to delete ' + item.name + '?', e)).then(function () {
      vizApi.remove(item.id).then(function () {
        utilService.showSuccessToast('Your visual was successfully deleted!');
      }, function () {
        utilService.showErrorToast('An error occured tyring to delete your visual. Please try again or contact support.');
      });
    });
  }

  function share(item, e) {
    utilService.setObj(item);

    $mdDialog.show({
      parent: angular.element(document.body),
      template: '<md-dialog flex="50"><dap-share-viz></dap-share-viz></md-dialog>',
      targetEvent: e,
      fullscreen: true
    });
  }

  function showCustomColor(item) {
    item.showColor = true;
  }

  function sort(sort) {
    sortState = sort;
    bind();
  }
};
