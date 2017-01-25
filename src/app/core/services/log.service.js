//log.service.js
angular
    .module('dap.core')
    .config(logConfig);

logConfig.$inject = ['$provide'];

function logConfig($provide) {
    $provide.decorator('$log', extendLogHandler);
}

extendLogHandler.$inject = ['$delegate', 'constants'];

function extendLogHandler($delegate, constants) {
    var logs = [],
        postErrCount = 0,
        postScheduler,
        logHandler = {
            info: info,
            warn: warn,
            error: error,
            debug: debug,
            saveLog: saveLog,
            shipLogs: shipLogs,
            startLogShipping: startLogShipping
        };

    return logHandler;

    ////////////
	function info(msg, ngModule, ngController) {
        $delegate.info(msg);
        logHandler.saveLog('info', msg, ngModule, ngController);
    }
 	
    function warn(msg, ngModule, ngController) {
        $delegate.warn(msg);
        logHandler.saveLog('warning', msg, ngModule, ngController);
    }

    function error(msg, ngModule, ngController) {
        $delegate.error(msg);
        logHandler.saveLog('error', msg, ngModule, ngController);
    }

    function debug(msg, ngModule, ngController) {
        $delegate.debug(msg);
        logHandler.saveLog('debug', msg, ngModule, ngController);
    }

    function saveLog(level, msg, ngModule, ngController) {
        logs.push({ 
            Level: level, 
            Message: msg,
            MetaData: {
                'ngModule': ngModule,
                'ngContorller': ngController
            }
        });
    }

    function shipLogs(http, interval) {
        if (logs.length > 0) {
            http.post(constants.API_BASE_URL + 'log', { "logs": logs })
                .then(function () {
                    logs = [];
                    postErrCount = 0;
                }, function (error) {
                    postErrCount++;

                    if (postErrCount > 10 && angular.isDefined(postScheduler)) {
                        interval.cancel(postScheduler);                        
                    }
                });
        }
    }

    function startLogShipping(http, interval) {
        postErrCount = 0;

        if (constants.LOG_SHIPPING_ENABLED === true) { 
            postScheduler = interval(function () {
                logHandler.shipLogs(http, interval);            
            }, constants.LOG_SHIP_INTERVAL);
        }
    }
}