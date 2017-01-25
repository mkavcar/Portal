//datamart.component.js
angular
  .module('dap.datamart')
  .component("datamart", {
    controller: DatamartController,
    templateUrl: 'app/datamart/datamart.html'
  });

DatamartController.$inject = ['utilService', '$rootRouter', '$mdDialog', 'authService', 'datamartApi', 'auditService'];

function DatamartController(utilService, $rootRouter, $mdDialog, authService, datamartApi, auditService) {
  var
    ctrl = this,
    appId = null;

  ctrl.selectedApp = {};
  ctrl.selectedTab = 'datamanagement';
  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.toggleMessage = toggleMessage;
  ctrl.toggleRow = toggleRow;
  ctrl.bindApplication = bindApplication;
  ctrl.bindDatasource = bindDatasource;
  ctrl.edit = edit;
  ctrl.navigate = navigate;


  ////////////
  function $routerOnActivate(next, previous) {
    //authorize
    authService.authorize();

    //audit
    auditService.add(auditService.assets.Datamart, null, auditService.actions.View)

    if (next.params.id && !isNaN(next.params.id)) {
      appId = parseInt(next.params.id);
      bindDatasource();
    }
    else {
      bindApplication();
    }
  }


  function bindApplication(search) {
    ctrl.applications = null;

    datamartApi.getApps().then(function (response) {
      ctrl.applications = utilService.filterArray(response.data.data || [], ['applicationName', 'applicationDescription'], search);
    }, function () {
      ctrl.applications = [];
    });
  }

  function bindDatasource(search) {
    ctrl.datasources = null;

    datamartApi.getApps().then(function (response) {
      ctrl.applications = response.data.data || [];
      ctrl.selectedApp = _.find(response.data.data || [], ['appid', appId]);

      datamartApi.getDatasource(ctrl.selectedApp.appid).then(function (response) {
        ctrl.datasources = utilService.filterArray(response.data.data || [], ['name', 'description'], search);
      }, function () {
        ctrl.datasources = [];
      });
    }, function () {
      ctrl.datasources = [];
      ctrl.applications = [];
    });
  }

  function edit() {

  }

  function navigate(comp, item) {
    $rootRouter.navigate([comp, { id: item.appid }]);
  }

  function toggleMessage(item, messageName) {
    //message
    $('#msg' + messageName + item.datasourceID).toggle(400);

    //icon
    $('#iconMore' + messageName + item.datasourceID).toggle();
    $('#iconLess' + messageName + item.datasourceID).toggle();
  }

  function toggleRow(item) {
    //message
    $("div[name='msg" + item.datasourceID + "']").toggle(400);

    //icon
    $('#iconMore' + item.datasourceID).toggle();
    $('#iconLess' + item.datasourceID).toggle();
  }
}
