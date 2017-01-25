//ccr.component.js
angular
  .module('dap.ccr')
  .component('ccr', {
    templateUrl: 'app/ccr/ccr.html',
    controller: CcrController,
    bindings: { $router: '<' },
    $routeConfig: [
      { path: '/dashboards', name: 'CcrDashboards', component: 'ccrDashboards', useAsDefault: true },
      { path: '/reports', name: 'CcrReports', component: 'ccrReports' },
      { path: '/support', name: 'CcrSupport', component: 'ccrSupport' },
      { path: '/dashboards/:id', name: 'CcrDashboardView', component: 'ccrDashboardView' }
    ]
  });

CcrController.$inject = ['$rootRouter', 'authService', '$location'];

function CcrController($rootRouter, authService, $location) {
  var ctrl = this;

  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.navigate = navigate;

  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize();

    //set selected tab
    var path = ($location.path() || '').split('/');

    switch (path[path.length - 1]) {
      case 'reports':
        ctrl.selectedTab = 'reports';
        break;
      case 'support':
        ctrl.selectedTab = 'support';
        break;
      default:
        ctrl.selectedTab = 'dashboards';
        break;
    }
  }

  function navigate(comp) {
    ctrl.$router.navigate([comp]);
  }
};
