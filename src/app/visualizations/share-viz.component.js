//share-viz.component.js
angular
  .module('dap.viz')
  .component("dapShareViz", {
    controller: ShareVizController,
    templateUrl: 'app/visualizations/share-viz.html'
  });

ShareVizController.$inject = ['vizApi', '$mdDialog', 'utilService'];

function ShareVizController(vizApi, $mdDialog, utilService) {
  var ctrl = this;
  ctrl.users = null;
  ctrl.save = save;
  ctrl.remove = remove;
  ctrl.close = close;
  ctrl.add = add;
  ctrl.$onInit = $onInit;


  ////////////
  function save() {
    if (ctrl.users) {
      ctrl.visual.authorizedUsers = ctrl.users.join(',');
    }

    vizApi.update(ctrl.visual).then(function () {
      utilService.showSuccessToast('The authorized users were successfully updated!');
      ctrl.close();
    }, function (response) {
      utilService.showErrorToast('An error occured tyring to update the authorized users. Please try again or contact support.');
    });
  }

  function add() {
    if (!_.some(ctrl.users, function (_item) { return _item === ctrl.user; })) {
      ctrl.users.push(ctrl.user);
      ctrl.user = '';
    }
    else
      utilService.showWarningToast('User already exists!');
  }

  function remove(item) {
    ctrl.users = _.filter(ctrl.users, function (_item) {
      return _item !== item;
    });
  }

  function $onInit() {
    ctrl.visual = utilService.getObj();
    ctrl.users = (ctrl.visual.authorizedUsers) ? ctrl.visual.authorizedUsers.split(',') : [];
  }

  function close() {
    $mdDialog.hide();
  }
};