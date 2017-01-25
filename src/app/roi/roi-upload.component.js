//roi-upload.component.js
angular
    .module('dap.roi')
    .component("roiUpload", {
        controller: RoiUploadController,
        templateUrl: 'app/roi/roi-upload.html'
    });

RoiUploadController.$inject = ['utilService', 'authService', 'auditService'];

function RoiUploadController(utilService, authService, auditService) {
    var ctrl = this;

    ctrl.$routerOnActivate = $routerOnActivate;

    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize();

        //audit
        auditService.add(auditService.assets['ROI Upload'], null, auditService.actions.View)
    }
}