//auth.service.js
angular
  .module('dap.core')
  .factory('authService', authService);

authService.$inject = ['$q', '$http', 'constants', '$log', 'tokenService', '$rootRouter', 'metadataApi', 'utilService'];

function authService($q, $http, constants, $log, tokenService, $rootRouter, metadataApi, utilService) {
  var authData = null,
    authToken = null,
    _isAppAdmin = false,
    metadataID = 'app_roles',
    authService = {
      roles: [],
      isLoggedIn: isLoggedIn,
      getUser: getUser,
      getToken: getToken,
      getRawToken: getRawToken,
      isInRole: isInRole,
      isInAnyRole: isInAnyRole,
      isInAllRole: isInAllRole,
      isAppAdmin: isAppAdmin,
      init: init,
      authorize: authorize
    };

  return authService;

  ////////////  
  function isLoggedIn() {
    return authData !== null;
  };

  function getUser() {
    return authData;
  };

  function getToken() {
    return authToken;
  };

  function getRawToken() {
    return getToken().replace('Bearer', '').trim();
  }

  function isInRole(role) {
    return _isAppAdmin || (isLoggedIn() && role && _.some(authData.Roles, function (item) { return item === role; }));
  };

  function isInAnyRole(roles) {
    return _isAppAdmin || _.some(roles, function (item) { return isInRole(item); })
  }

  function isInAllRole(roles) {
    return _.every(roles, function (item) { return isInRole(item); })
  }

  function isAppAdmin() {
    return _isAppAdmin;
  };

  function authorize(role) {
    if (isLoggedIn()) {
      if (!_isAppAdmin) {
        if (role && !isInRole(role))
          $rootRouter.navigate(['AccessDenied']);
      }
    }
    else
      $rootRouter.navigate(['Splash']);
  }

  function init() {
    if (constants.AUTH_DISABLED === true) {
      //auth bypass for local development only !!
      authData = {
        'Id': 'john.doe@groupm.com',
        'ADUsername': 'john.doe',
        'Email': 'john.doe@groupm.com',
        'FirstName': 'John',
        'LastName': 'Doe',
        'Domain': 'AD',
        'LoginMethod': 'windows',
        'LoginTimeStamp': '2016-10-05T08:40:21.084-04:00',
        'Roles': ['app.admin']
      };
      _isAppAdmin = true;

      //init app meta data
      return metadataApi.get(metadataID, true).then(function (response) {
        authService.roles = response.data.data || [];
      });
    }
    else {
      return $http.get(constants.AUTHAPI_BASE_URL + 'user').then(function (response) {
        var token = response.headers('Authorization');
        if (token && response.data.Data) {
          authData = response.data.Data;
          authToken = token;
          tokenService.setToken(token);
          //$window.sessionStorage.setItem('authData', authData);
          //$window.sessionStorage.setItem('authToken', token);

          //init app meta data
          return metadataApi.get(metadataID, true).then(function (response) {
            authService.roles = response.data.data || [];
            _isAppAdmin = isInRole(authService.roles.app_admin);

            return authData;
          });
        }
        else
          return $q.reject();
      }, function (response) {
        if (response.status !== 403 && response.status !== 401)
          $log.error('Access Denied: ' + response.statusText, 'dap.core', 'authService');

        if (response.status === 500) {
          $log.error('Error getting user context: ' + response.statusText, 'dap.core', 'authService');
          utilService.showErrorToast('An error occured tyring login. Please try again or contact support.');
        }

        return $q.reject(response);
      });
    }
  };
};
