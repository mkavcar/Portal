//roi.service.js
angular
  .module('dap.roi')
  .factory('roiApi', roiApi);

roiApi.$inject = ['$http', 'roiConstants'];

function roiApi($http, roiConstants) {
  var roiApi = {
    getMetaData: getMetaData,
    getAggregated: getAggregated,
    getQuery: getQuery
  };

  return roiApi;

  ////////////
  function getMetaData() {
    return $http.get(roiConstants.API_BASE_URL + '/metadata', { cache: true });
  }

  function getAggregated(type) {
    return $http.get(roiConstants.API_BASE_URL + '/aggregated/' + type, { cache: true });
  }

  function getQuery(request) {
    return $http.get(roiConstants.API_BASE_URL + '/query', { params: request, cache: true });
  }
};
