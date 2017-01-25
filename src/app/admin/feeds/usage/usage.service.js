//usage.service.js
angular
  .module('dap.feeds.admin')
  .factory('feedsUsageApi', feedsUsageApi);

feedsUsageApi.$inject = ['$http'];

function feedsUsageApi($http) {
  var feedsUsageApi = {
        getAll: getAll
      };

  return feedsUsageApi;
  
  ////////////
  function getAll() {
    
  }
};
