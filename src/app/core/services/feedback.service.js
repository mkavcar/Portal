//feedback.service.js
angular
  .module('dap.core')
  .factory('feedbackApi', feedbackApi);

feedbackApi.$inject = ['$http', 'constants'];

function feedbackApi($http, constants) {
  var API_PATH = 'feedback',
      feedbackApi = {
        get: get,
        add: add
      };

  return feedbackApi;
  
  ////////////
  function get() {
    return $http.get(constants.API_BASE_URL + API_PATH, { cache: false });
  }

  function add(message) {
    return $http.post(constants.API_BASE_URL + API_PATH, { message: message });
  }
};
