//login-button.component.js
angular
  .module('dap.core')
  .component("dapLoginButton", {
    controller: LoginButtonController,
    templateUrl: 'app/core/components/login-button.html'
  });

LoginButtonController.$inject = ['authService', '$mdDialog'];

function LoginButtonController(authService, $mdDialog) {
  var ctrl = this;
  ctrl.isLoggedIn = isLoggedIn;
  ctrl.getUser = getUser;
  ctrl.settings = settings;

  ////////////
  function isLoggedIn() {
    return authService.isLoggedIn();
  }

  function getUser() {
    return authService.getUser();
  }


  function settings(e) {
    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'app/core/components/user-settings.html',
      controller: MySettingsController,
      targetEvent: e,
      fullscreen: true,
      controllerAs: 'ctrl',
      bindToController: true,
      locals: { settings: authService.getUser().AppSettings }
    });
  }
};

MySettingsController.$inject = ['$mdDialog', 'metadataApi', 'utilService'];

function MySettingsController($mdDialog, metadataApi, utilService) {
  var ctrl = this;

  ctrl.views = [{ value: 'Home', text: 'Home (Default)' }, { value: 'MyViz', text: 'Visualization Library' }, { value: 'Documents', text: 'Documents Library' }];

  if (ctrl.settings && ctrl.settings.defaultView)
    ctrl.settings.defaultView = { value: ctrl.settings.defaultView };
  else
    ctrl.settings = { defaultView: { value: 'Home' } };


  ctrl.close = function () {
    $mdDialog.hide();
  }

  ctrl.save = function (setting) {
    metadataApi.update(setting).then(function () {
      utilService.showSuccessToast('Your settings were successfully saved!');
      $mdDialog.hide();
    }, function () {
      utilService.showErrorToast('An error occured tyring to save your settings. Please try again or contact support.');
    });
  }
}