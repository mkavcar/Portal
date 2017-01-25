//feeds-admin.component.js
angular
  .module('dap.feeds.admin')
  .component('feedsAdmin', {
    templateUrl: 'app/admin/feeds/feeds-admin.html',
    bindings: { $router: '<' },
    controller: FeedsAdminController,
    $routeConfig: [
      {path: '/feeds/users', name: 'FeedUsers', component: 'feedUser', useAsDefault: true },
      {path: '/feeds/usage', name: 'FeedUsage', component: 'feedUsage' }
    ]
});

FeedsAdminController.$inject = ['$rootRouter', 'authService'];

function FeedsAdminController($rootRouter, authService) {
  var ctrl = this;
  
  ctrl.navigate = navigate;

  ////////////
  function navigate(comp) {
    ctrl.$router.navigate([comp]);
  }
};
