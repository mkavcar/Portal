//documents.component.js
angular
  .module('dap.documents')
  .component("documents", {
    controller: DocumentsController,
    templateUrl: 'app/documents/documents.html'
  });

DocumentsController.$inject = ['utilService', '$rootRouter', '$mdDialog', 'authService', 'documentsApi', 'auditService'];

function DocumentsController(utilService, $rootRouter, $mdDialog, authService, documentsApi, auditService) {
  var
    ctrl = this,
    searchState = null,
    sortState = 'name asc';

  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.search = search;
  ctrl.sort = sort;
  ctrl.view = view;
  ctrl.sortFields = [{ value: 'name asc', name: 'Name (A-Z)' },
  { value: 'name desc', name: 'Name (Z-A)' }];


  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize();

    bind();

    //audit
    auditService.add(auditService.assets['Documents Library'], null, auditService.actions.View)
  }


  function bind() {
    ctrl.documents = null;

    documentsApi.get().then(function (response) {
      ctrl.documents = utilService.filterArray(response.data.data || [], ['name', 'description'], searchState, sortState);
    }, function () {
      ctrl.documents = [];
    });
  }

  function view(item, ev) {
    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'app/documents/view-document.html',
      targetEvent: ev,
      fullscreen: true,
      clickOutsideToClose: true,
      controller: ViewDocumentController,
      controllerAs: 'ctrl',
      bindToController: true,
      locals: { document: item }
    });
  }

  function search(search) {
    searchState = search;
    bind();
  }

  function sort(sort) {
    sortState = sort;
    bind();
  }
}

ViewDocumentController.$inject = ['$sce', '$mdDialog'];

function ViewDocumentController($sce, $mdDialog) {
  var ctrl = this;

  //ctrl.path = $sce.trustAsResourceUrl(ctrl.document.path);
  ctrl.path = $sce.trustAsResourceUrl('https://nycgrmmkav1.ad.insidemedia.net/flashdocs/example');

  ctrl.cancel = function () {
    $mdDialog.cancel();
  }
}