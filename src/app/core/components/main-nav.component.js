//main-nav.component.js
angular
  .module('dap.core')
  .component("dapMainNav", {
    controller: MainNavController,
    templateUrl: 'app/core/components/main-nav.html'
  });

MainNavController.$inject = ['$rootRouter', '$window', 'authService', 'menuApi', '$mdSidenav', '$scope', '$rootScope'];

function MainNavController($rootRouter, $window, authService, menuApi, $mdSidenav, $scope, $rootScope) {
  var ctrl = this,
    metadataID = 'app_menu';

  ctrl.$onInit = bind;
  ctrl.select = select;
  ctrl.access = access;
  ctrl.hasSubMenu = hasSubMenu;


  $scope.$on('DAP.CORE.METADATA.REFRESH', function (event, args) {
    if (args.id === metadataID)
      bind(true);
  });

  ////////////
  function bind(refresh) {
    ctrl.menu = null;
    return menuApi.get(metadataID, refresh).then(function (response) {
      ctrl.menu = response || [];

      if (!$rootScope.appTitle) {
        var route = $rootRouter.lastNavigationAttempt.split('/')[1];

        if (route !== 'home') {
          _.forEach(ctrl.menu, function (item) {
            if (item.type === 'state') {
              if (item.url.toLowerCase().indexOf(route) > -1) {
                $rootScope.appTitle = item.name;
                return false;
              }
            }
            else if (item.submenu) {
              _.forEach(item.submenu, function (subItem) {
                if (subItem.type === 'state') {
                  if (subItem.url.toLowerCase().indexOf(route) > -1) {
                    $rootScope.appTitle = subItem.name;
                    return false;
                  }
                }
              });
            }
          });
        }
      }
    });
  }

  function select(item) {
    if (item.type === 'header' && hasSubMenu(item)) {
      item.showSubmenu = ((!item.showSubmenu) ? true : false);
    }
    else {
      if (item.hasAcess !== false) {
        if (item.type === 'state') {
          $rootScope.appTitle = ((item.name === 'Home') ? null : item.name);
          $rootRouter.navigate([item.url]);
        }
        else
          $window.open(item.url);

        $mdSidenav('dapMainNav').toggle();
      }
    }
  }

  function access(item, $event) {


    $mdSidenav('dapMainNav').toggle();
  }

  function hasSubMenu(item) {
    return (item.submenu && item.submenu.length > 0);
  }
};