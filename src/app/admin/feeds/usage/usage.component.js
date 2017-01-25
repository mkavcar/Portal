//usage.component.js
angular
  .module('dap.feeds.admin')
  .component("feedsUsage", {
    controller: FeedsUsageController,
    templateUrl: 'app/admin/feeds/usage/usage.html'
});

FeedsUsageController.$inject = ['feedsUsageApi', '$rootRouter'];
  
function FeedsUsageController(feedsUsageApi, $rootRouter) {
  var 
    ctrl = this;
  
};
