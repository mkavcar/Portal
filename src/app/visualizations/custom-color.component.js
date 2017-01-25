//custom-color.component.js
angular
  .module('dap.viz')
  .component("dapVizCustomColor", {
    controller: CustomColorController,
    bindings: {
      item: '<',
      orientation: '@'
    },
    templateUrl: 'app/visualizations/custom-color.html'
  });

CustomColorController.$inject = ['vizApi', 'utilService'];

function CustomColorController(vizApi, utilService) {
  var
    ctrl = this;

  ctrl.hide = hide;
  ctrl.save = save;
  ctrl.$onInit = $onInit;


  ////////////
  function $onInit() {
    ctrl.item.theme = (ctrl.item.customPrimaryColor || ctrl.item.customAccentColor) ? 'custom' : 'default';
    ctrl.item.origPrimaryColor = ctrl.item.customPrimaryColor;
    ctrl.item.origAccentColor = ctrl.item.customAccentColor;
  }

  function hide(item) {
    item.customPrimaryColor = item.origPrimaryColor;
    item.customAccentColor = item.origAccentColor;
    item.showColor = false;
  }

  function save(item) {
    if (item.theme === 'default') {
      item.customPrimaryColor = null;
      item.customAccentColor = null;
    }

    vizApi.update(item).then(function () {
      utilService.showSuccessToast('The visual was successfully updated!');
    }, function (error, status) {
      item.customPrimaryColor = item.origPrimaryColor;
      item.customAccentColor = item.origAccentColor;
      utilService.showErrorToast('An error occured tyring to update the visual. Please try again or contact support.');
    });
  }
};
