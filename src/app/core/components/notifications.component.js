//notifications.component.js
angular
  .module('dap.core')
  .component("dapNotifications", {
    controller: NotificationsController,
    templateUrl: 'app/core/components/notifications.html'
});

NotificationsController.$inject = ['$mdDialog', '$mdPanel', 'notificationApi', '$scope'];

function NotificationsController($mdDialog, $mdPanel, notificationApi, $scope) {
  var ctrl = this;
      ctrl._mdPanel = $mdPanel;
      ctrl.notifications = null;
      ctrl.unread = 0;

  ctrl.show = show;
  ctrl.$onInit = bind;

    //events
    $scope.$on('DAP.CORE.NOTIFICATION.REFRESH', function() {
        bind();
    });
  
  ////////////
  function bind() {
    ctrl.notifications = null;
    notificationApi.get().then(function (response) {
      ctrl.notifications = response.data.data || [];
      ctrl.unread = _.filter(ctrl.notifications, function(item) { return (item.isRead === false); }).length;
    });
  }

  function show(ev) {
   
    var position = ctrl._mdPanel.newPanelPosition()
      .relativeTo('#dapNotificationButton')
      .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);
    
    var animation = ctrl._mdPanel.newPanelAnimation()
      .openFrom('#dapNotificationButton')
      .closeTo('#dapNotificationButton')
      .withAnimation(ctrl._mdPanel.animation.FADE);

    ctrl._mdPanel.open({
      animation: animation,
      attachTo: angular.element(document.body),
      controller: NotificationsMenuController,
      controllerAs: 'ctrl',
      templateUrl: 'app/core/components/notifications-menu.html',
      panelClass: 'md-whiteframe-4dp',
      position: position,
      locals: {
        'notifications': ctrl.notifications
      },
      openFrom: ev,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 2
    });
  }

  function NotificationsMenuController() {

  }
};