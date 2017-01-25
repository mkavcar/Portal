//documents.service.js
angular
  .module('dap.documents')
  .factory('documentsApi', documentsApi);

documentsApi.$inject = ['$http', 'documentsConstants'];

function documentsApi($http, documentsConstants) {
  var documentsApi = {
    get: get
  };

  return documentsApi;

  ////////////
  function get() {
    return $http.get(documentsConstants.API_BASE_URL + '/documents', { cache: true });
  }
};
