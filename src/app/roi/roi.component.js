//roi.component.js
angular
  .module('dap.roi')
  .component('roi', {
    templateUrl: 'app/roi/roi.html',
    controller: RoiController,
    bindings: { $router: '<' },
    $routeConfig: [
      {path: '/dashboard', name: 'RoiDashboard', component: 'roiDashboard', useAsDefault: true },
      {path: '/query', name: 'RoiQuery', component: 'roiQuery' },
      {path: '/upload', name: 'RoiUpload', component: 'roiUpload' }
    ]
});

RoiController.$inject = ['$rootRouter', 'authService', '$location'];

function RoiController($rootRouter, authService, $location) {
  var ctrl = this;
  
  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.navigate = navigate;

  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize();

    //set selected tab
    var path = ($location.path() || '').split('/');
    
    switch (path[path.length-1]) {  
      case 'query':
        ctrl.selectedTab = 'query';
        break;
      case 'upload':
        ctrl.selectedTab = 'upload';
        break;
      default:
        ctrl.selectedTab = 'dashboard';
        break;
    }
  }

  function navigate(comp) {
    ctrl.$router.navigate([comp]);
  }
};
