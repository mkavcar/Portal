//app-admin.service.js
angular
  .module('dap.app.admin')
  .factory('appAdminApi', appAdminApi);

appAdminApi.$inject = ['$http', 'constants', '$rootScope'];

function appAdminApi($http, constants, $rootScope) {
  var API_PATH = 'admin/users',
    appAdminApi = {
      getUsers: getUsers,
      filterUsers: filterUsers,
      updateUser: updateUser,
      addUser: addUser,
      removeUser: removeUser
    };

  return appAdminApi;

  ////////////
  function getUsers() {
    return $http.get(constants.API_BASE_URL + API_PATH, { cache: false });
  }

  function addUser(user) {
    return $http.post(constants.API_BASE_URL + API_PATH, user).then(function () {
      $rootScope.$broadcast('DAP.APP.ADMIN.REFRESH_USER');
    });
  }

  function updateUser(user) {
    return $http.put(constants.API_BASE_URL + API_PATH + '/' + user.id, user).then(function () {
      $rootScope.$broadcast('DAP.APP.ADMIN.REFRESH_USER');
    });
  }

  function removeUser(id) {
    return $http.delete(constants.API_BASE_URL + API_PATH + '/' + id).then(function () {
      $rootScope.$broadcast('DAP.APP.ADMIN.REFRESH_USER');
    });
  }

  function isAppAdmin(user) {

  }

  function isGroupAdmin(user, group) {

  }

  function filterUsers(data, search) {
    if (angular.isArray(data) && data.length > 0 && search) {
      search = search.toLowerCase();

      return data.filter(function (item) {
        var res = false;

        res = (item.id && item.id.toLowerCase().indexOf(search) >= 0);

        /*if (!res && item.group)
          res = (item.agency.toLowerCase().indexOf(search) >= 0);

        if (!res && item.country)
          res = (item.country.toLowerCase().indexOf(search) >= 0);

        if (!res && item.role)
          res = (item.role.toLowerCase().indexOf(search) >= 0);

        if (!res && item.firstName+item.lastName)
          res = ((item.firstName+item.lastName).toLowerCase().indexOf(search) >= 0);
*/
        return res;
      });
    }

    return data;
  }
};
