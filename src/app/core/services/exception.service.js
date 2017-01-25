//exception.service.js
angular
    .module('dap.core')
    .config(exceptionConfig);

exceptionConfig.$inject = ['$provide'];

function exceptionConfig($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
}

extendExceptionHandler.$inject = ['$delegate', '$log'];

function extendExceptionHandler($delegate, $log) {
    return function(exception, cause) {
        $delegate(exception, cause);
        
        var error;
        if (exception && exception.stack)
            error = exception.stack;
        else if (exception && exception.message)
            error = exception.message;
        else
            error = exception.toString();
        
        $log.saveLog('error', error);
        
    };
}