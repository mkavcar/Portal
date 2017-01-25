//ccr-dashboard-view.component.js
angular
    .module('dap.ccr')
    .component("ccrDashboardView", {
        controller: CcrDashboardViewController,
        templateUrl: 'app/ccr/ccr-dashboard-view.html'
    });

CcrDashboardViewController.$inject = ['vizApi', 'notesApi', 'utilService', '$rootRouter', '$sce', '$mdDialog', 'authService', 'vizConstants', '$scope', 'auditService', '$window'];

function CcrDashboardViewController(vizApi, notesApi, utilService, $rootRouter, $sce, $mdDialog, authService, vizConstants, $scope, auditService, $window) {
    var
        ctrl = this,
        defaultErr = 'An error occured tyring to access your dashboard. Please try again or contact support.';

    ctrl.showNotes = false;

    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.back = back;

    //events
    $scope.$on('DAP.VIZ.REFRESH', function (event, args) {
        bind(ctrl.selectedItem.id, true);
    });


    ////////////
    function $routerOnActivate(next, previous) {
        //authorize
        authService.authorize();
        ctrl.isAdmin = authService.isInRole(authService.roles.app_admin);

        bind(next.params.id);

        //audit
        auditService.add(auditService.assets['CCR Dashboard View'], next.params.id, auditService.actions.View)
    }

    function bind(id, cacheRefresh) {
        ctrl.selectedItem = null;

        vizApi[(ctrl.isAdmin) ? 'getAll' : 'get'](cacheRefresh).then(function (response) {
            ctrl.selectedItem = _.find(response.data.data.visuals, ['id', parseInt(id)]);

            if (ctrl.selectedItem && ctrl.selectedItem.url) {
                ctrl.selectedItem.iframeUrl = null;

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

    //** USED WHEN TABLEAU KERBEROS IS ENABLED
    function parseUrl(item) {
        return item.url.split('?')[0] + '?:embed=yes&:tabs=' + ((item.showTabs === true) ? 'yes' : 'no') + '&:toolbar=' + ((item.showToolbar === true) ? 'yes' : 'no');
    }

    //** USED WHEN TABLEAU TRUSTED AUTH IS ENABLED
    function parseTrustedUrl(item, token) {
        return item.url.replace('/t/', '/trusted/' + token + '/t/');
    }

    function back() {
        $window.history.back();
    }
};
