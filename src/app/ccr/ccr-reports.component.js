//ccr-reports.component.js
angular
  .module('dap.ccr')
  .component("ccrReports", {
    controller: CcrReportsController,
    templateUrl: 'app/ccr/ccr-reports.html'
});

CcrReportsController.$inject = ['utilService', 'authService', '$mdDialog', 'auditService', 'constants'];

function CcrReportsController(utilService, authService, $mdDialog, auditService, constants) {
    var 
        ctrl = this;

    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.info = info;

    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize();

        //audit
        auditService.add(auditService.assets['CCR Reports'], null, auditService.actions.View)
    }

    function info(name, e) {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'htmltemplates/ccr-'+ name +'-info.html',
            targetEvent: e,
            controller: CcrInfoController,
            controllerAs: 'ctrl',
            bindToController: true,
            fullscreen: true
        });
    }
}


CcrInfoController.$inject = ['$mdDialog'];

function CcrInfoController($mdDialog) {
    var ctrl = this;
    ctrl.close = function() { $mdDialog.hide(); }
}