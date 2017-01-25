//app.component.js
angular
  .module('dap.app')
  .component('app', {
    templateUrl: 'app/app.html',
    controller: AppController,
    $routeConfig: [
      { path: '/', name: 'Splash', component: 'splash', useAsDefault: true },
      { path: '/home', name: 'Home', component: 'home' },
      { path: '/admin/...', name: 'Admin', component: 'admin' },
      { path: '/feeds', name: 'Feeds', component: 'feeds' },
      { path: '/viz', name: 'MyViz', component: 'myviz' },
      { path: '/viz/:id', name: 'VizDashboard', component: 'vizDashboard' },
      { path: '/viz/auditlog/:id', name: 'VizAuditlog', component: 'vizAuditlog' },
      { path: '/viz/auditlog', name: 'VizAuditlogAll', component: 'vizAuditlog' },
      { path: '/documents', name: 'Documents', component: 'documents' },
      { path: '/accessdenied', name: 'AccessDenied', component: 'accessDenied' },
      { path: '/appadmin/...', name: 'AppAdmin', component: 'appAdmin' },
      { path: '/feedsadmin/...', name: 'FeedsAdmin', component: 'feedsAdmin' },
      { path: '/ccr/...', name: 'Ccr', component: 'ccr' },
      { path: '/roi/...', name: 'Roi', component: 'roi' },
      { path: '/datamart', name: 'Datamart', component: 'datamart' },
      { path: '/datamart/:id', name: 'DMDataSource', component: 'datamart' },
    ]
  });

AppController.$inject = ['$rootScope', '$rootRouter', 'authService'];

function AppController($rootScope, $rootRouter, authService) {
  var
    ctrl = this;

  ctrl.navigate = navigate;

  $rootScope.auth = authService;
  $rootScope.isLegacyBrowser = (navigator.userAgent.indexOf('WebKit') == -1);


  ////////////
  function navigate(comp) {
    ctrl.$rootRouter.navigate([comp]);
  }
};
