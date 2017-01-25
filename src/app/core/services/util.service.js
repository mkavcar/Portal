//util.service.js
angular
    .module('dap.core')
    .factory("utilService", utilService);

utilService.$inject = ['$mdToast', '$mdDialog'];

function utilService($mdToast, $mdDialog) {
    var _obj = null,
        utilService = {
            getObj: getObj,
            setObj: setObj,
            showErrorToast: showErrorToast,
            showSuccessToast: showSuccessToast,
            showWarningToast: showWarningToast,
            deleteConfirmDialog: deleteConfirmDialog,
            filter: filter,
            filterArray: filterArray
        };

    return utilService;

    ////////////  
    function getObj() {
        return _obj;
    }

    function setObj(obj) {
        _obj = obj;
    }

    function showToast(message, cssClass, hideDelay) {
        $mdToast.show({
            hideDelay: hideDelay || 6000,
            position: 'top right',
            template: '<md-toast><span class="md-toast-text" flex>' + message + '</span></md-toast>',
            toastClass: cssClass
        });
    }

    function showSuccessToast(message, hideDelay) {
        showToast(message, 'dap-toast-success', hideDelay);
    }

    function showErrorToast(message, hideDelay) {
        showToast(message, 'dap-toast-error', hideDelay);
    }

    function showWarningToast(message, hideDelay) {
        showToast(message, 'dap-toast-warning', hideDelay);
    }

    function deleteConfirmDialog(title, message, event) {
        return $mdDialog.confirm()
            .title(title)
            .textContent(message)
            .ariaLabel(title)
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');
    }

    /*function filter(item, fields, search) {
        var res = true;

        if (search && item && fields) {
            search = search.toLowerCase();

            if (fields.length > 0 && item[fields[0]])
                res = filterItem(item[fields[0]], search);

            _.forEach(fields, function(value) {
                if (!res && item[value]) {
                    res = filterItem(item[value], search);      
                }
            });
        }

        return (res === null) ? true : res;
    }*/

    function filterArray(data, fields, search, sort) {
        var res = data;

        if (search && data.length > 0) {
            search = search.toLowerCase();
            res = _.filter(data, function (item) {
                return filter(item, fields, search);
            });
        }

        if (sort && res.length > 0) {
            var _sort = sort.split(' ');
            var _dir = (_sort.length === 2 && _sort[1].toLowerCase() === 'desc') ? 'desc' : 'asc';

            res = _.orderBy(res, [_sort[0]], [_dir]);
        }

        return res;
    }

    function filter(item, fields, search) {
        var res = null;

        if (search && item && fields) {
            for (var i = 0; i < fields.length; i++) {
                if (res === null && item[fields[i]])
                    res = filterItem(item[fields[i]], search);
                else {
                    if (!res && item[fields[i]]) {
                        res = filterItem(item[fields[i]], search);
                    }
                }
            }
        }

        return (res === null) ? true : res;
    }

    function filterItem(item, search) {
        if (_.isArray(item)) {
            return _.some(item, function (_item) {
                return (_item.toLowerCase().indexOf(search) >= 0);
            });
        }
        else
            return (item.toLowerCase().indexOf(search) >= 0);
    }
}