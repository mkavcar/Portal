//feedsApi.service.js
angular
  .module('dap.feeds')
  .factory('feedsApi', feedsApi);

feedsApi.$inject = ['$http', 'feedsConstants'];

function feedsApi($http, feedsConstants) {
  var API_PATH = 'feed',
      feedsApi = {
        getAll: getAll,
        filter: filter
      };

  return feedsApi;
  
  ////////////
  function getAll() {
    return $http.get(feedsConstants.API_BASE_URL + API_PATH, { cache: true });
  }

  function filter(item, cat0, cat1, search) {
    var res = true,
        resCat1 = false,
        resSearch = false;

    if (cat0 && cat0 !== 0) {
      res = (item.catID0 === cat0);
    }

    if (cat1 && cat1 !== 0) {
      resCat1 = (item.catID1 === cat1);

      if (res)
        res = (res === resCat1);
    }

    if (search) {
      search = search.toLowerCase();

      resSearch = (item.name.toLowerCase().indexOf(search) >= 0);
      
      if (!resSearch && item.catName0)
        resSearch = (item.catName0.toLowerCase().indexOf(search) >= 0);
         
      if (!resSearch && item.catName1) 
        resSearch = (item.catName1.toLowerCase().indexOf(search) >= 0);
        
      if (!resSearch && item.catName2)
        resSearch = (item.catName2.toLowerCase().indexOf(search) >= 0);
    
      if (res)
        res = (res === resSearch);
    }

    return res;
  }
};
