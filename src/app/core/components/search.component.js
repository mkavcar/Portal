//search.component.js
angular
    .module('dap.core')
    .component("dapSearch", {
        bindings: {
            sortFields: '<',
            defaultSort: '@',
            searchModel: '<',
            onSearch: '&',
            onSort: '&'
        },
        controller: SearchController,
        templateUrl: 'app/core/components/search.html'
    });

function SearchController() {
    var ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;

    function $onInit() {
        ctrl.sort = ctrl.defaultSort;
        ctrl.search = ctrl.searchModel;
    }

    function $onChanges() {
        ctrl.search = ctrl.searchModel;
        ctrl.onSearch({search: ctrl.search});
    }
}