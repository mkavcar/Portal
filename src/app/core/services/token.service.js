//token.service.js
angular
  .module('dap.core')
  .factory("tokenService", tokenService);


function tokenService () {
    var authToken = null,
        tokenService = {
            getToken: getToken,
            setToken: setToken  
        };

    return tokenService;

    ////////////  
    function getToken() {
        return authToken;
    }

    function setToken(token) {
        authToken = token;
    }
}