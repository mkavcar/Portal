//ccr-dashboards.component.js
angular
    .module('dap.ccr')
    .component("ccrDashboards", {
        controller: CcrDashboardsController,
        bindings: { $router: '<' },
        templateUrl: 'app/ccr/ccr-dashboards.html'
    });

CcrDashboardsController.$inject = ['vizApi', 'utilService', '$rootRouter', 'authService', 'vizConstants', '$scope', 'auditService', '$timeout'];

function CcrDashboardsController(vizApi, utilService, $rootRouter, authService, vizConstants, $scope, auditService, $timeout) {
    var
        ctrl = this,
        searchState = null,
        sortState = 'updatedDate desc';

    ctrl.selectedItem = null;
    ctrl.baseUrl = vizConstants.BASE_URL;
    ctrl.isAdmin = false;
    ctrl.visuals = null;
    ctrl.sortFields = [{ value: 'updatedDate desc', name: 'Last Change' },
    { value: 'name asc', name: 'Name (A-Z)' },
    { value: 'name desc', name: 'Name (Z-A)' }];

    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.filter = filter;
    ctrl.navigate = navigate;
    ctrl.sort = sort;

    //events
    $scope.$on('DAP.VIZ.REFRESH', function (event, args) {
        bind(true);
    });


    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize();

        if (authService.isInRole(authService.roles.ccr_admin))
            ctrl.isAdmin = true;

        bind();

        //audit
        auditService.add(auditService.assets['CCR Dashboard'], null, auditService.actions.View)
    }

    function bind(cacheRefresh) {
        ctrl.visuals = null;

        vizApi[(ctrl.isAdmin) ? 'getAll' : 'get'](cacheRefresh).then(function (response) {
            ctrl.visuals = _.filter(utilService.filterArray(response.data.data.visuals || [], ['name', 'tags'], searchState, sortState), ['folder', 'CCR']);
        }, function (error) {
            ctrl.visuals = [];
        });
    }

    function filter(search) {
        searchState = search;
        bind();
    }

    function navigate(comp, id) {
        ctrl.$router.navigate([comp, { id: id }]);
    }

    function sort(sort) {
        sortState = sort;
        bind();
    }
}