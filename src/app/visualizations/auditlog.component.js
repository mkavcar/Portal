//auditlog.component.js
angular
    .module('dap.viz')
    .component("vizAuditlog", {
        controller: AuditLogController,
        templateUrl: 'app/visualizations/auditlog.html'
    });

AuditLogController.$inject = ['auditService', '$rootRouter', 'authService', 'vizApi', 'utilService'];

function AuditLogController(auditService, $rootRouter, authService, vizApi, utilService) {
    var
        ctrl = this,
        searchState = null;

    ctrl.isAdmin = false;
    ctrl.viewsByUserOptions = {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        }
    };

    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.filter = filter;
    ctrl.navigate = navigate;


    ////////////
    function $routerOnActivate(next, previous) {
        //authorize
        authService.authorize(authService.roles.visuals_creator);

        if (authService.isInRole(authService.roles.visuals_admin)) {
            ctrl.isAdmin = true;
        }

        ctrl.visualId = (next.params || {}).id || null;

        bindChartByDate();
        bindChartByUser();

        //audit
        auditService.add(auditService.assets['Visualizations Library Audit Log'], null, auditService.actions.View)
    }

    function bind() {
        auditService.get(auditService.assets['Visualizations Library Dashboard'], ctrl.visualId).then(function (response) {
            ctrl.auditlog = utilService.filterArray(response.data.data || [], ['userId', 'username', 'action'], searchState) || [];
        });

        vizApi[(ctrl.isAdmin) ? 'getAll' : 'get']().then(function (response) {
            if (ctrl.visualId)
                ctrl.selectedItem = _.find(response.data.data.visuals, ['id', parseInt(ctrl.visualId)]);
            else
                ctrl.visuals = _.keyBy(response.data.data.visuals, 'id');
        });

    }

    function bindChartByDate() {
        auditService.getViewsByDate(auditService.assets['Visualizations Library Dashboard'], ctrl.visualId).then(function (response) {
            var data = response.data.data || [];

            ctrl.viewsByDateLabels = _.map(data.detail, 'date');
            ctrl.viewsByDate = _.map(data.detail, 'views');
            ctrl.totalViews = data.aggregate;

            ctrl.viewsByDateDataset = [
                {
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ];
        });
    }

    function bindChartByUser() {
        auditService.getViewsByUser(auditService.assets['Visualizations Library Dashboard'], ctrl.visualId).then(function (response) {
            var data = response.data.data || [];

            ctrl.viewsByUserLabels = _.map(data.detail, 'username');
            ctrl.viewsByUser = _.map(data.detail, 'views');
            ctrl.totalUsers = data.aggregate;
        });
    }

    function filter(search) {
        searchState = search;
        bind();
    }

    function navigate(comp) {
        $rootRouter.navigate([comp]);
    }
};
