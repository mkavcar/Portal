//manage-menu.component.js
angular
    .module('dap.app.admin')
    .component("dapAppAdminManageMenu", {
        controller: ManageMenuController,
        templateUrl: 'app/admin/app/menu/manage-menu.html'
    });

ManageMenuController.$inject = ['metadataApi', '$mdDialog', 'utilService', 'constants', 'authService'];

function ManageMenuController(metadataApi, $mdDialog, utilService, constants, authService) {
    var ctrl = this,
        rootMenuItem = null;

    ctrl.submit = submit;
    ctrl.close = close;
    ctrl.$onInit = $onInit;
    ctrl.querySearch = querySearch;

    ////////////
    function submit() {
        if (ctrl.operation === 'add') {
            ctrl.menulist.push(ctrl.menu);
        }
        else if (ctrl.operation === 'addsubmenu') {
            rootMenuItem.push(ctrl.menu);
        }

        metadataApi.update('app_menu', ctrl.menulist).then(function () {
            utilService.showSuccessToast('The menu was successfully updated!');
            ctrl.close();
        }, function (response) {
            utilService.showErrorToast('An error occured tyring to updated the menu. Please try again or contact support.');
        });
    }

    function $onInit() {
        var obj = utilService.getObj();
        var sourceMenu = _.cloneDeep(obj.data);
        ctrl.operation = obj.op;

        metadataApi.get('app_menu').then(function (response) {
            ctrl.menulist = response.data.data || [];

            if (ctrl.operation === 'edit') {
                ctrl.menu = _.find(ctrl.menulist, ['name', sourceMenu.name]);

                if (!ctrl.menu) {
                    _.forEach(ctrl.menulist, function (item) {
                        if (_.isArray(item.submenu)) {
                            ctrl.menu = _.find(item.submenu, ['name', sourceMenu.name]);
                            if (ctrl.menu) return false;
                        }
                    });
                }
            }
            else if (ctrl.operation === 'addsubmenu') {
                rootMenuItem = _.find(ctrl.menulist, ['name', sourceMenu.name]);
            }
            else
                ctrl.menu = {};

            ctrl.menu.roles = (ctrl.menu.roles) ? ctrl.menu.roles : [];
        });
    }

    function close() {
        ctrl.dataForm.$setPristine();
        $mdDialog.hide();
    }

    function querySearch(query) {
        var filteredRoles = _.filter(_.values(authService.roles), function (item) { return !_.some(ctrl.menu.roles, function (subitem) { return subitem === item }); })

        return query ? _.filter(filteredRoles, function (item) { return (item.indexOf(query) > -1); }) : [];
    }
};