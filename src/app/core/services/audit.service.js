//audit.service.js
angular
    .module('dap.core')
    .factory('auditService', auditService);

auditService.$inject = ['$http', 'constants', '$cacheFactory'];

function auditService($http, constants, $cacheFactory) {
    var cache = $cacheFactory('auditCache'),
        API_PATH = 'auditlog',
        auditService = {
            actions: [],
            assets: [],
            get: get,
            getViewsByUser: getViewsByUser,
            getViewsByDate: getViewsByDate,
            init: init,
            add: add
        };

    return auditService;

    ////////////
    function get(assetId, assetSubId, cacheRefresh) {
        if (cacheRefresh === true)
            cache.removeAll();

        return $http.get(constants.API_BASE_URL + API_PATH + ((assetId) ? '/' + assetId : '') + ((assetSubId) ? '/' + assetSubId : ''), { cache: cache });
    }

    function getViewsByUser(assetId, assetSubId, cacheRefresh) {
        if (cacheRefresh === true)
            cache.removeAll();

        return $http.get(constants.API_BASE_URL + API_PATH + '/viewsbyuser' + ((assetId) ? '/' + assetId : '') + ((assetSubId) ? '/' + assetSubId : ''), { cache: cache });
    }

    function getViewsByDate(assetId, assetSubId, cacheRefresh) {
        if (cacheRefresh === true)
            cache.removeAll();

        return $http.get(constants.API_BASE_URL + API_PATH + '/viewsbydate' + ((assetId) ? '/' + assetId : '') + ((assetSubId) ? '/' + assetSubId : ''), { cache: cache });
    }

    function init() {
        return $http.get(constants.API_BASE_URL + API_PATH + '/metadata', { cache: true }).then(function (response) {
            var data = response.data.data || {};

            auditService.actions = _.invert(data.actions);
            auditService.assets = _.invert(data.assets);
        });
    }

    function add(assetId, assetSubId, actionId) {
        return $http.post(constants.API_BASE_URL + API_PATH, { assetId: assetId, assetSubId: assetSubId, actionId: actionId });
    }
};
