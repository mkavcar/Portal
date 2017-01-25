//notifications.component.js
angular
    .module('dap.app.admin')
    .component("appAdminNotifications", {
        controller: AppAdminNotificationsController,
        templateUrl: 'app/admin/app/notifications/notifications.html'
    });

AppAdminNotificationsController.$inject = ['notificationApi', 'authService', 'utilService', '$scope', '$mdDialog', 'auditService'];

function AppAdminNotificationsController(notificationApi, authService, utilService, $scope, $mdDialog, auditService) {
    var
        ctrl = this;

    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.filter = filter;
    ctrl.remove = remove;
    ctrl.add = add;

    //events
    $scope.$on('DAP.CORE.NOTIFICATION.REFRESH', function () {
        bind();
    });


    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize(authService.roles.app_admin);

        bind();

        //audit
        auditService.add(auditService.assets['Portal Admin Notifications'], null, auditService.actions.View)
    }

    function bind() {
        ctrl.data = null;
        notificationApi.getAll().then(function (response) {
            ctrl.data = response.data.data || [];
        });
    }

    function filter(item) {
        return utilService.filter(item, ['message', 'title', 'userId'], ctrl.search);
    }

    function add(e) {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'app/admin/app/notifications/add-notification.html',
            targetEvent: e,
            controller: AddNotificationController,
            controllerAs: 'ctrl',
            bindToController: true,
            fullscreen: true
        });
    }

    function remove(item, e) {
        $mdDialog.show(utilService.deleteConfirmDialog('Delete Notification', 'Are you sure you want to delete ' + item.title + '?', e)).then(function () {

            notificationApi.remove(item.id).then(function () {
                utilService.showSuccessToast('The notification was successfully deleted!');
            }, function (response) {
                utilService.showErrorToast('An error occured tyring to delete the notification. Please try again or contact support.');
            });
        });
    }
};


AddNotificationController.$inject = ['notificationApi', '$mdDialog', 'utilService'];

function AddNotificationController(notificationApi, $mdDialog, utilService) {
    var ctrl = this;

    ctrl.close = function () {
        $mdDialog.hide();
    }

    ctrl.submit = function () {
        notificationApi.add(ctrl.notification).then(function () {
            utilService.showSuccessToast('Your notification was successfully added!');
            $mdDialog.hide();
        }, function () {
            utilService.showErrorToast('An error occured tyring to add your notification. Please try again or contact support.');
        });
    }
}