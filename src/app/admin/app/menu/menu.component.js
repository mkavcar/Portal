//menu.component.js
angular
  .module('dap.app.admin')
  .component("appAdminMenu", {
    controller: AppAdminMenuController,
    templateUrl: 'app/admin/app/menu/menu.html'
  });

AppAdminMenuController.$inject = ['metadataApi', 'authService', '$mdDialog', 'utilService', '$scope', '$timeout', 'auditService'];

function AppAdminMenuController(metadataApi, authService, $mdDialog, utilService, $scope, $timeout, auditService) {
  var
    ctrl = this,
    metadataID = 'app_menu';

  ctrl.showAllSubmenus = false;
  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.filter = filter;
  ctrl.add = add;
  ctrl.edit = edit;
  ctrl.remove = remove;
  ctrl.hasSubMenu = hasSubMenu;
  ctrl.toggle = toggle;
  ctrl.toggleAll = toggleAll;

  //events
  $scope.$on('DAP.CORE.METADATA.REFRESH', function (event, args) {
    if (args.id === metadataID)
      bind(true);
  });


  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize(authService.roles.app_admin);

    bind();

    //audit
    auditService.add(auditService.assets['Portal Admin Menu'], null, auditService.actions.View)
  }

  function bind(refresh) {
    ctrl.menu = null;
    metadataApi.get(metadataID, refresh).then(function (response) {
      ctrl.menu = _.sortBy(response.data.data || [], ['order']);
    });
  }

  function add(item, e) {
    utilService.setObj({ op: ((item) ? 'addsubmenu' : 'add'), data: item });
    showDialog(e);
  }

  function edit(item, e) {
    utilService.setObj({ op: 'edit', data: item });
    showDialog(e);
  }

  function remove(item, subitem, e) {
    $mdDialog.show(utilService.deleteConfirmDialog('Delete Menu Item', 'Are you sure you want to delete ' + item.name + '?', e)).then(function () {
      if (!subitem) {
        ctrl.menu = _.filter(ctrl.menu, function (_item) {
          return _item.name !== item.name;
        });
      }
      else {
        var itemRoot = _.find(ctrl.menu, function (_item) {
          return _item.name === item.name;
        });

        if (itemRoot) {
          itemRoot.submenu = _.filter(itemRoot.submenu, function (_item) {
            return _item.name !== subitem.name;
          });
        }
      }

      metadataApi.update(metadataID, ctrl.menu).then(function () {
        utilService.showSuccessToast('The menu item was successfully deleted!');
      }, function (response) {
        bind();
        utilService.showErrorToast('An error occured tyring to delete the menu item. Please try again or contact support.');
      });
    });
  }

  function showDialog(e) {
    $mdDialog.show({
      parent: angular.element(document.body),
      template: '<md-dialog flex="70"><dap-app-admin-manage-menu></dap-app-admin-manage-menu></md-dialog>',
      targetEvent: e,
      fullscreen: true
    });
  }

  function filter(item) {
    var res = true;

    if (ctrl.search) {
      var search = ctrl.search.toLowerCase();

      res = (item.name.toLowerCase().indexOf(search) >= 0);

      if (!res && item.roles) {
        res = _.some(item.roles, function (role) {
          return (role.toLowerCase().indexOf(search) >= 0);
        });
      }

      if (!res && item.submenu) {
        res = _.some(item.submenu, function (subitem) {
          return (subitem.name.toLowerCase().indexOf(search) >= 0);
        });
      }
    }

    return res;
  }

  function hasSubMenu(item) {
    return (item.submenu && item.submenu.length > 0);
  }

  function toggle(item) {
    item.showSubmenu = ((!item.showSubmenu) ? true : false);
  }

  function toggleAll() {
    ctrl.showAllSubmenus = !ctrl.showAllSubmenus;

    _.each(ctrl.menu, function (item) {
      item.showSubmenu = ctrl.showAllSubmenus;
    });
  }
};
