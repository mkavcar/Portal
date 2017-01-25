//notes.service.js
angular
  .module('dap.viz')
  .factory('notesApi', notesApi);

notesApi.$inject = ['$http', 'vizConstants', '$rootScope', '$cacheFactory', 'auditService', 'authService'];

function notesApi($http, vizConstants, $rootScope, $cacheFactory, auditService, authService) {
  var cache = $cacheFactory('vizNotesCache'),
    API_PATH = 'notes',
    notesApi = {
      get: get,
      add: add,
      update: update,
      remove: remove,
      getExportUrl: getExportUrl
    };

  return notesApi;

  ////////////
  function get(id, cacheRefresh) {
    if (cacheRefresh === true)
      cache.removeAll();

    if (id)
      return $http.get(vizConstants.API_BASE_URL + API_PATH + '/' + id, { params: { id: id }, cache: cache });
    else
      return $http.get(vizConstants.API_BASE_URL + API_PATH, { cache: cache });
  }

  function add(item) {
    return $http.post(vizConstants.API_BASE_URL + API_PATH, item).then(function () {
      $rootScope.$broadcast('DAP.VIZ.NOTES.REFRESH');
      auditService.add(auditService.assets['Visualizations Library'], item.visualId, auditService.actions.Add_NOTE)
    });
  }

  function update(item) {
    return $http.put(vizConstants.API_BASE_URL + API_PATH, item).then(function () {
      $rootScope.$broadcast('DAP.VIZ.NOTES.REFRESH');
      auditService.add(auditService.assets['Visualizations Library'], item.id, auditService.actions.Update_NOTE);
    });
  }

  function remove(id) {
    return $http.delete(vizConstants.API_BASE_URL + API_PATH + '/' + id, { params: { id: id } }).then(function () {
      $rootScope.$broadcast('DAP.VIZ.NOTES.REFRESH');
      auditService.add(auditService.assets['Visualizations Library'], id, auditService.actions.Delete_NOTE);
    });
  }

  function getExportUrl(id) {
    return vizConstants.API_BASE_URL + API_PATH + '/notes.csv?id=' + id + '&token=' + authService.getRawToken();
  }
};
