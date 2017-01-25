//http-token.service.js

angular
  .module('dap.core')
  .config(httpTokenConfig);  

//config  
httpTokenConfig.$inject = ['$httpProvider'];

function httpTokenConfig($httpProvider) {
    var httpTokenService = function ($injector) {
        return {
            request: function(config) {
                var tokenService = $injector.get('tokenService');
                var token = tokenService.getToken();

                if (token)
                    config.headers.Authorization = token;
                
                return config;
            }
        };
    }

    $httpProvider.interceptors.push(['$injector', httpTokenService]);
}
