'use strict';

//app.module.js
angular
  .module('dap.app', [
    'ngComponentRouter',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'chart.js',
    'dap.core',
    'dap.app.admin',
    'dap.feeds.admin',
    'dap.feeds',
    'dap.viz',
    'dap.documents',
    'dap.ccr',
    'dap.roi',
    'dap.datamart'])
  .config(config)
  .run(run)
  .value('$routerRootComponent', 'app');

config.$inject = ['$locationProvider', '$mdThemingProvider', '$httpProvider', '$compileProvider'];

function config($locationProvider, $mdThemingProvider, $httpProvider, $compileProvider) {
  $locationProvider.html5Mode(true);
  $httpProvider.useApplyAsync(true);
  //$compileProvider.debugInfoEnabled(false);

  //$compileProvider.commentDirectivesEnabled(false);  **Not working
  //$compileProvider.cssClassDirectivesEnabled(false); **Not working

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('light-blue')
    .backgroundPalette('grey');
}

run.$inject = ['$log', '$http', '$interval', 'authService', '$rootScope', '$rootRouter', '$location', 'auditService', '$q'];

function run($log, $http, $interval, authService, $rootScope, $rootRouter, $location, auditService, $q) {
  $rootScope.loading = true;
  $log.startLogShipping($http, $interval);

  //init auth
  authService.init().then(function (response) {
    var user = response;

    //init all metadata
    auditService.init().then(function () {
      $rootScope.loading = false;

      if ($location.path() === "/") {
        if (user.AppSettings && user.AppSettings.defaultView)
          $rootRouter.navigate([user.AppSettings.defaultView]);
        else
          $rootRouter.navigate(['Home']);
      }

    }, function () {
      return $q.reject();
    });
  }, function (response) {
    $rootScope.loading = false;
    $rootRouter.navigate(['Splash']);
  });
}