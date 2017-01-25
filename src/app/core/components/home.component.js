//home.component.js
angular
  .module('dap.core')
  .component("home", {
    controller: HomeController,
    templateUrl: 'app/core/components/home.html'
  });

HomeController.$inject = ['$rootRouter', 'menuApi', '$rootScope', '$window', 'auditService', 'authService'];

function HomeController($rootRouter, menuApi, $rootScope, $window, auditService, authService) {
  var ctrl = this,
    isAdmin = false,
    metadataID = 'app_menu';

  ctrl.navigate = navigate;
  ctrl.access = access;
  ctrl.$routerOnActivate = $routerOnActivate;

  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize();

    $rootScope.appTitle = null;

    bind();

    //audit
    auditService.add(auditService.assets.Home, null, auditService.actions.View)
  }

  function navigate(item) {
    if (item.hasAccess !== false) {
      if (item.type === 'state') {
        $rootScope.appTitle = ((item.name === 'Home') ? null : item.name);
        $rootRouter.navigate([item.url]);
      }
      else
        $window.open(item.url);
    }
  }

  function access(item, e) {
    console.log('user click: access');
  }

  function bind(refresh) {
    ctrl.menu = null;

    menuApi.get(metadataID, refresh).then(function (response) {
      var
        data = response || [],
        _menu = null;

      ctrl.menuCore = _.filter(data, function (item) {
        return !item.submenu && item.order !== 1;
      });
      _menu = _.filter(data, function (item) {
        return item.submenu;
      });
      _menu.unshift({
        name: 'Core Applications',
        submenu: ctrl.menuCore
      });

      _.forEach(_menu, function (item) {
        item.submenu = _.chunk(item.submenu, 2);
      });

      ctrl.menu = _menu;
    }, function () {
      ctrl.menu = [];
    });
  }
};