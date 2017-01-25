//metadata.service.js
angular
  .module('dap.core')
  .factory('metadataApi', metadataApi);

metadataApi.$inject = ['$http', 'constants', '$cacheFactory', '$rootScope'];

function metadataApi($http, constants, $cacheFactory, $rootScope) {
  var cache = $cacheFactory('metaCache'),
    API_PATH = 'metadata',
    metadataApi = {
      get: get,
      update: update/*,
        add: add,
        remove: remove*/
    };

  return metadataApi;

  ////////////
  function get(id, cacheRefresh) {
    if (cacheRefresh === true)
      cache.removeAll();

    return $http.get(constants.API_BASE_URL + API_PATH + '/' + id, { cache: cache });
  }

  function update(id, value) {
    return $http.put(constants.API_BASE_URL + API_PATH + '/' + id, { id: id, value: value }).then(function () {
      $rootScope.$broadcast('DAP.CORE.METADATA.REFRESH', { id: id });
    });
  }

  /*function add(id, value) {
    return $http.post(constants.API_BASE_URL + API_PATH, { id: id, value: value });
  }

  function remove(id) {
    return $http.delete(constants.API_BASE_URL + API_PATH, { params: { id: id } });
  }*/
};
