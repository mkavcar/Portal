//http-requestid.service.js

angular
  .module('dap.core')
  .config(httpRequestIDConfig);  

//config  
httpRequestIDConfig.$inject = ['$httpProvider'];

function httpRequestIDConfig($httpProvider) {
    var httpRequestIDService = function () {
        return {
            request: function(config) {
                config.headers['X-Client-RequestID'] = generateGUID();
                
                return config;
            }
        };
    }

    var generateGUID = function() {
        var d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    $httpProvider.interceptors.push(httpRequestIDService);
}
