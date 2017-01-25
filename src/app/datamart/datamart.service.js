//datamart.service.js
angular
  .module('dap.datamart')
  .factory('datamartApi', datamartApi);

datamartApi.$inject = ['$http', 'datamartConstants', '$q'];

function datamartApi($http, datamartConstants, $q) {
  var datamartApi = {
    getApps: getApps,
    getDatasource: getDatasource
  };

  return datamartApi;

  ////////////
  function getApps() {
    return $http.get(datamartConstants.API_BASE_URL + '/application', { cache: true });
  }

  function getDatasource(appid) {
    return $http.get(datamartConstants.API_BASE_URL + '/datasource/' + appid, { cache: false });
  }
};
