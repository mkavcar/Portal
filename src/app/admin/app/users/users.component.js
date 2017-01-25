//users.component.js
angular
  .module('dap.app.admin')
  .component("appAdminUsers", {
    controller: AppAdminUsersController,
    templateUrl: 'app/admin/app/users/users.html'
  });

AppAdminUsersController.$inject = ['appAdminApi', 'authService', '$mdDialog', 'utilService', '$scope', 'auditService', 'metadataApi'];

function AppAdminUsersController(appAdminApi, authService, $mdDialog, utilService, $scope, auditService, metadataApi) {
  var
    ctrl = this,
    metadataID = 'app_roles',
    _roleSource = null;

  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.filter = filter;
  ctrl.edit = edit;
  ctrl.remove = remove;
  ctrl.addRole = addRole;
  ctrl.removeRole = removeRole;

  //events
  $scope.$on('DAP.APP.ADMIN.REFRESH_USER', function () {
    bind();
  });


  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize(authService.roles.app_admin);

    bind();
    bindRoles();

    //audit
    auditService.add(auditService.assets['Portal Admin Users'], null, auditService.actions.View)
  }

  function bind() {
    ctrl.users = null;
    appAdminApi.getUsers().then(function (response) {
      ctrl.users = response.data.data || [];
    });
  }

  function bindRoles() {
    ctrl.roles = null;
    metadataApi.get(metadataID, true).then(function (response) {
      _roleSource = response.data.data || [];
      ctrl.roles = _.values(_roleSource);
    });
  }

  function edit(item, e) {
    utilService.setObj(item);

    $mdDialog.show({
      parent: angular.element(document.body),
      template: '<md-dialog flex="70"><dap-app-admin-manage-users></dap-app-admin-manage-users></md-dialog>',
      targetEvent: e,
      fullscreen: true
    });
  }

  function remove(item, e) {
    $mdDialog.show(utilService.deleteConfirmDialog('Delete User', 'Are you sure you want to delete ' + item.userid + '?', e)).then(function () {
      appAdminApi.removeUser(item.userid).then(function () {
        utilService.showSuccessToast('The user was successfully deleted!');
      }, function (response) {
        utilService.showErrorToast('An error occured tyring to delete the user. Please try again or contact support.');
      });
    });
  }

  function addRole(role) {
    _roleSource[role.replace('.', '_')] = role;

    metadataApi.update(metadataID, _roleSource).then(function () {
      utilService.showSuccessToast('The role was successfully updated!');
      ctrl.role = '';
      ctrl.roles.push(role);
    }, function (response) {
      utilService.showErrorToast('An error occured tyring to update the role. Please try again or contact support.');
    });
  }

  function removeRole(item, e) {
    $mdDialog.show(utilService.deleteConfirmDialog('Delete Role', 'Are you sure you want to delete ' + item + '?', e)).then(function () {
      delete _roleSource[item.replace('.', '_')];

      metadataApi.update(metadataID, _roleSource).then(function () {
        bindRoles();
        utilService.showSuccessToast('The role was successfully deleted!');
      }, function (response) {
        utilService.showErrorToast('An error occured tyring to delete the role. Please try again or contact support.');
      });
    });
  }

  function filter(item) {
    return utilService.filter(item, ['userid', 'roles'], ctrl.search);
  }
};

