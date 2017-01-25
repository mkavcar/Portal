//manage-users.component.js
angular
    .module('dap.app.admin')
    .component("dapAppAdminManageUsers", {
        controller: ManageUsersController,
        templateUrl: 'app/admin/app/users/manage-users.html'
    });

ManageUsersController.$inject = ['appAdminApi', '$mdDialog', 'utilService', 'constants', 'authService'];

function ManageUsersController(appAdminApi, $mdDialog, utilService, constants, authService) {
    var ctrl = this;
    ctrl.submit = submit;
    ctrl.close = close;
    ctrl.$onInit = $onInit;
    ctrl.querySearch = querySearch;

    ////////////
    function submit() {
        if (!ctrl.isUpdate) {
            appAdminApi.addUser(ctrl.user).then(function () {
                utilService.showSuccessToast('The user was successfully added!');
                ctrl.close();
            }, function (error, status) {
                utilService.showErrorToast('An error occured tyring to add the user. Please try again or contact support.');
            });
        }
        else {
            appAdminApi.updateUser(ctrl.user).then(function () {
                utilService.showSuccessToast('The user was successfully added!');
                ctrl.close();
            }, function (error, status) {
                utilService.showErrorToast('An error occured tyring to add the user. Please try again or contact support.');
            });
        }
    }

    function $onInit() {
        ctrl.user = _.cloneDeep(utilService.getObj());
        ctrl.isUpdate = (ctrl.user);

        if (!ctrl.isUpdate)
            ctrl.user = { roles: [] };
    }

    function close() {
        ctrl.dataForm.$setPristine();
        $mdDialog.hide();
    }

    function querySearch(query) {
        var filteredRoles = _.filter(_.values(authService.roles), function (item) { return !_.some(ctrl.user.roles, function (subitem) { return subitem === item }); })

        return query ? _.filter(filteredRoles, function (item) { return (item.indexOf(query) > -1); }) : [];
    }
};