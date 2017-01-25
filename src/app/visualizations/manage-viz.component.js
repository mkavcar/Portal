//manage-viz.component.js
angular
  .module('dap.viz')
  .component("dapManageViz", {
    controller: ManageVizController,
    templateUrl: 'app/visualizations/manage-viz.html'
  });

ManageVizController.$inject = ['vizApi', '$mdDialog', 'utilService'];

function ManageVizController(vizApi, $mdDialog, utilService) {
  var ctrl = this;
  ctrl.submit = submit;
  ctrl.close = close;
  ctrl.$onInit = $onInit;

  ////////////
  function submit() {
    //if (ctrl.authorizedUsersArray)
    //  ctrl.visual.authorizedUsers = ctrl.authorizedUsersArray.join(',');

    if (ctrl.tags)
      ctrl.visual.tags = ctrl.tags.join(',');

    if (!ctrl.isUpdate) {
      vizApi.add(ctrl.visual).then(function () {
        utilService.showSuccessToast('The visual was successfully added!');
        ctrl.close();
      }, function (error, status) {
        utilService.showErrorToast('An error occured tyring to add the visual. Please try again or contact support.');
      });
    }
    else {
      vizApi.update(ctrl.visual).then(function () {
        utilService.showSuccessToast('The visual was successfully updated!');
        ctrl.close();
      }, function (error, status) {
        utilService.showErrorToast('An error occured tyring to update the visual. Please try again or contact support.');
      });
    }
  }

  function $onInit() {
    ctrl.visual = utilService.getObj();
    ctrl.isUpdate = (ctrl.visual);
    ctrl.tags = (ctrl.visual && ctrl.visual.tags) ? ctrl.visual.tags.split(',') : [];

    //if (ctrl.isUpdate && ctrl.visual.authorizedUsers)
    //  ctrl.authorizedUsersArray = ctrl.visual.authorizedUsers.split(',');
  }

  function close() {
    ctrl.vizForm.$setPristine();
    $mdDialog.hide();
  }
};