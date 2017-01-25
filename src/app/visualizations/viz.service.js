//viz.service.js
angular
  .module('dap.viz')
  .factory('vizApi', vizApi);

vizApi.$inject = ['$http', 'vizConstants', '$rootScope', '$cacheFactory', 'auditService', '$q'];

function vizApi($http, vizConstants, $rootScope, $cacheFactory, auditService, $q) {
  var cache = $cacheFactory('vizCache'),
    API_PATH = 'visuals',
    vizApi = {
      get: get,
      getAll: getAll,
      add: add,
      update: update,
      remove: remove,
      getToken: getToken
    };

  return vizApi;

  ////////////
  function get(cacheRefresh) {
    if (cacheRefresh === true)
      cache.removeAll();

    return $http.get(vizConstants.API_BASE_URL + API_PATH, { cache: cache });
  }

  function getAll(cacheRefresh) {
    if (cacheRefresh === true)
      cache.removeAll();

    return $http.get(vizConstants.API_BASE_URL + API_PATH + '/all', { cache: cache });
  }

  function add(item) {
    return $http.post(vizConstants.API_BASE_URL + API_PATH, item).then(function (response) {
      $rootScope.$broadcast('DAP.VIZ.REFRESH');
      auditService.add(auditService.assets['Visualizations Library'], response.data.data.id, auditService.actions.Add)
    });
  }

  function update(item) {
    return $http.put(vizConstants.API_BASE_URL + API_PATH + '/' + item.id, item).then(function () {
      $rootScope.$broadcast('DAP.VIZ.REFRESH');
      auditService.add(auditService.assets['Visualizations Library'], item.id, auditService.actions.Update);
    });
  }

  function remove(id) {
    return $http.delete(vizConstants.API_BASE_URL + API_PATH + '/' + id).then(function () {
      $rootScope.$broadcast('DAP.VIZ.REFRESH');
      auditService.add(auditService.assets['Visualizations Library'], id, auditService.actions.Delete);
    });
  }

  function getToken(siteId) {
    return $http.get('https://app-uat.groupm.com/vizapi/tableautoken/' + siteId, { cache: false }).then(function (response) {
      if (response.data.data && response.data.data.token)
        return response.data.data.token;
      else
        return $q.reject();
    });
  }
};
