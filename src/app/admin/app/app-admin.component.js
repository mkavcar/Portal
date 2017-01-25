//app-admin.component.js
angular
  .module('dap.app.admin')
  .component('appAdmin', {
    templateUrl: 'app/admin/app/app-admin.html',
    controller: AppAdminController,
    bindings: { $router: '<' },
    $routeConfig: [
      {path: '/users', name: 'AppAdminUsers', component: 'appAdminUsers', useAsDefault: true },
      {path: '/menu', name: 'AppAdminMenu', component: 'appAdminMenu' },
      {path: '/feedback', name: 'AppAdminFeedback', component: 'appAdminFeedback' },
      {path: '/notifications', name: 'AppAdminNotifications', component: 'appAdminNotifications' }
    ]
});

AppAdminController.$inject = ['$rootRouter', 'authService', '$location'];

function AppAdminController($rootRouter, authService, $location) {
  var ctrl = this;
  
  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.navigate = navigate;

  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize('app.admin');

    //set selected tab
    var path = ($location.path() || '').split('/');
    
    switch (path[path.length-1]) {
      case 'menu':
        ctrl.selectedTab = 'menu';
        break;    
      case 'feedback':
        ctrl.selectedTab = 'feedback';
        break;
      case 'notifications':
        ctrl.selectedTab = 'notifications';
        break;
      default:
        ctrl.selectedTab = 'users';
        break;
    }
  }

  function navigate(comp) {
    ctrl.$router.navigate([comp]);
  }
};
