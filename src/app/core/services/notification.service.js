//notification.service.js
angular
  .module('dap.core')
  .factory('notificationApi', notificationApi);

notificationApi.$inject = ['$http', 'constants', '$cacheFactory', '$rootScope'];

function notificationApi($http, constants, $cacheFactory, $rootScope) {
  var API_PATH = 'notification',
    notificationApi = {
      get: get,
      getAll: getAll,
      getUnread: getUnread,
      update: update,
      add: add,
      remove: remove
    };

  return notificationApi;

  ////////////
  function get() {
    return $http.get(constants.API_BASE_URL + API_PATH, { cache: false });
  }

  function getAll() {
    return $http.get(constants.API_BASE_URL + API_PATH + '/all', { cache: false });
  }

  function getUnread() {
    return $http.get(constants.API_BASE_URL + API_PATH + '/unread', { cache: false });
  }

  function update(id) {
    return $http.put(constants.API_BASE_URL + API_PATH + '/' + id).then(function () {
      $rootScope.$broadcast('DAP.CORE.NOTIFICATION.REFRESH');
    });
  }

  function add(request) {
    return $http.post(constants.API_BASE_URL + API_PATH, request).then(function () {
      $rootScope.$broadcast('DAP.CORE.NOTIFICATION.REFRESH');
    });
  }

  function remove(id) {
    return $http.delete(constants.API_BASE_URL + API_PATH + '/' + id).then(function () {
      $rootScope.$broadcast('DAP.CORE.NOTIFICATION.REFRESH');
    });
  }
};
