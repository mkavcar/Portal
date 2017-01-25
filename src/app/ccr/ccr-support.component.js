//ccr-support.component.js
angular
    .module('dap.ccr')
    .component("ccrSupport", {
        controller: CcrSupportController,
        templateUrl: 'app/ccr/ccr-support.html'
    });

CcrSupportController.$inject = ['utilService', 'authService', 'auditService', 'constants'];

function CcrSupportController(utilService, authService, auditService, constants) {
    var
        ctrl = this;

    ctrl.$routerOnActivate = $routerOnActivate;

    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize();

        //audit
        auditService.add(auditService.assets['CCR Support'], null, auditService.actions.View)
    }
}