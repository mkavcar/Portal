//viz-dashboard.component.js
angular
    .module('dap.viz')
    .component("vizDashboard", {
        controller: VizDashboardController,
        templateUrl: 'app/visualizations/viz-dashboard.html'
    });

VizDashboardController.$inject = ['vizApi', 'notesApi', 'utilService', '$rootRouter', '$sce', '$mdDialog', 'authService', 'vizConstants', '$scope', 'auditService'];

function VizDashboardController(vizApi, notesApi, utilService, $rootRouter, $sce, $mdDialog, authService, vizConstants, $scope, auditService) {
    var
        ctrl = this,
        defaultErr = 'An error occured tyring to access your dashboard. Please try again or contact support.';

    ctrl.showNotes = false;

    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.showDialog = showDialog;
    ctrl.navigate = navigate;
    ctrl.edit = edit;
    ctrl.remove = remove;
    ctrl.share = share;
    ctrl.showCustomColor = showCustomColor;

    //events
    $scope.$on('DAP.VIZ.REFRESH', function (event, args) {
        bind(ctrl.selectedItem.id, true);
    });


    ////////////
    function $routerOnActivate(next, previous) {
        //authorize
        authService.authorize();
        ctrl.canEdit = authService.isInAnyRole([authService.roles.visuals_admin, authService.roles.visuals_creator]);
        ctrl.isAdmin = authService.isInRole(authService.roles.visuals_admin);

        bind(next.params.id);

        //audit
        auditService.add(auditService.assets['Visualizations Library Dashboard'], next.params.id, auditService.actions.View)
    }

    function bind(id, cacheRefresh) {
        ctrl.selectedItem = null;

        vizApi[(ctrl.isAdmin) ? 'getAll' : 'get'](cacheRefresh).then(function (response) {
            ctrl.selectedItem = _.find(response.data.data.visuals, ['id', parseInt(id)]);

            if (ctrl.selectedItem && ctrl.selectedItem.url) {
                ctrl.selectedItem.iframeUrl = null;

                //ctrl.selectedItem.iframeUrl = $sce.trustAsResourceUrl(parseUrl(ctrl.selectedItem));  //** USED WHEN TABLEAU KERBEROS IS ENABLED
                //ctrl.selectedItem.iframeUrl = $sce.trustAsResourceUrl(ctrl.selectedItem.url); //** USED WHEN TABLEAU PROXY IS ENABLED

                vizApi.getToken(ctrl.selectedItem.siteId).then(function (token) {
                    ctrl.selectedItem.iframeUrl = $sce.trustAsResourceUrl(parseTrustedUrl(ctrl.selectedItem, token));  //** USED WHEN TABLEAU TRUSTED AUTH IS ENABLED
                }, function () {
                    utilService.showErrorToast(defaultErr);
                    delete ctrl.selectedItem.iframeUrl;
                });
            }
            else
                utilService.showErrorToast(defaultErr);
        }, function () {
            utilService.showErrorToast(defaultErr);
        });
    }

    function showDialog(item, e) {
        utilService.setObj(item);

        $mdDialog.show({
            parent: angular.element(document.body),
            template: '<md-dialog flex="70"><dap-manage-viz></dap-manage-viz></md-dialog>',
            targetEvent: e,
            fullscreen: true
        });
    }

    function showShareDialog(item, e) {
        utilService.setObj(item);

        $mdDialog.show({
            parent: angular.element(document.body),
            template: '<md-dialog flex="50"><dap-share-viz></dap-share-viz></md-dialog>',
            targetEvent: e,
            fullscreen: true
        });
    }

    //** USED WHEN TABLEAU KERBEROS IS ENABLED
    function parseUrl(item) {
        return item.url.split('?')[0] + '?:embed=yes&:tabs=' + ((item.showTabs === true) ? 'yes' : 'no') + '&:toolbar=' + ((item.showToolbar === true) ? 'yes' : 'no');
    }

    //** USED WHEN TABLEAU TRUSTED AUTH IS ENABLED
    function parseTrustedUrl(item, token) {
        return item.url.replace('/t/', '/trusted/' + token + '/t/');
    }

    function navigate(comp) {
        $rootRouter.navigate([comp]);
    }

    function edit(e) {
        utilService.setObj(ctrl.selectedItem);

        $mdDialog.show({
            parent: angular.element(document.body),
            template: '<md-dialog flex="70"><dap-manage-viz></dap-manage-viz></md-dialog>',
            targetEvent: e,
            fullscreen: true
        });
    }

    function remove(e) {
        $mdDialog.show(utilService.deleteConfirmDialog('Delete Visual', 'Are you sure you want to delete ' + ctrl.selectedItem.name + '?', e)).then(function () {
            vizApi.remove(ctrl.selectedItem.id).then(function () {
                utilService.showSuccessToast('Your visual was successfully deleted!');
                navigate('MyViz');
            }, function () {
                utilService.showErrorToast('An error occured tyring to delete your visual. Please try again or contact support.');
            });
        });
    }

    function share(e) {
        utilService.setObj(ctrl.selectedItem);

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
};
