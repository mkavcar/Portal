//search.service.js
angular
  .module('dap.core')
  .factory("searchService", searchService);

searchService.$inject = ["$rootScope"];

function searchService ($rootScope) {
    var searchObj = {
            text: '',
            uid: null
        },
        subject = 'search-event',
        searchService = {
          get: get,
          subscribe: subscribe,
          publish: publish
        };
  
    return searchService;
    
    ////////////  
    function get(){
        return searchObj;
    };
  
    function subscribe($scope, callback) {
        var handler = $rootScope.$on(subject, callback);
        $scope.$on('$destroy', handler);
    };

    function publish(text, uid) {
        if (text !== undefined) searchObj.text = text;
        if (uid !== undefined) searchObj.uid = uid;
        $rootScope.$emit(subject);
    };
  };
