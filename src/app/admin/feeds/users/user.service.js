//user.service.js
angular
  .module('dap.feeds.admin')
  .factory('feedUserApi', feedUserApi);

feedUserApi.$inject = ['$http', 'constants'];

function feedUserApi($http, constants) {
  var feedUserApi = {
        getAll: getAll,
        filter: filter
      };

  return feedUserApi;
  
  ////////////
  function getAll() {
    return $http.get(constants.API_BASE_URL + 'user', { cache: true });
  }

  function filter(data, search) {
    if (angular.isArray(data) && data.length > 0 && search) {
      search = search.toLowerCase();

      return data.filter(function(item) {
        var res = false;
        
        res = (item.email && item.email.toLowerCase().indexOf(search) >= 0);
        
        if (!res && item.agency)
          res = (item.agency.toLowerCase().indexOf(search) >= 0);

        if (!res && item.country)
          res = (item.country.toLowerCase().indexOf(search) >= 0);

        if (!res && item.role)
          res = (item.role.toLowerCase().indexOf(search) >= 0);

        if (!res && item.firstName+item.lastName)
          res = ((item.firstName+item.lastName).toLowerCase().indexOf(search) >= 0);

        return res;
      });
    }

    return data;
  }
};
