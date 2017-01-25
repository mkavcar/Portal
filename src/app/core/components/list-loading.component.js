//list-loading.component.js
angular
  .module('dap.core')
  .component("dapListLoading", {
    bindings: {
        list: '<',
        filteredlist: '<',
        notFoundMessage: '@'
    },
    templateUrl: 'app/core/components/list-loading.html'
});