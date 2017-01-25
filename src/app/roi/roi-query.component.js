//roi-query.component.js
angular
    .module('dap.roi')
    .component("roiQuery", {
        controller: RoiQueryController,
        templateUrl: 'app/roi/roi-query.html'
    });

RoiQueryController.$inject = ['authService', 'roiApi', 'utilService', '$mdDialog', 'auditService'];

function RoiQueryController(authService, roiApi, utilService, $mdDialog, auditService) {
    var
        ctrl = this,
        _data = [];

    ctrl.request = {};
    ctrl.data = [];
    ctrl.$routerOnActivate = $routerOnActivate;
    ctrl.filter = filter;
    ctrl.filterSubCat = filterSubCat;
    ctrl.bind = bind;
    ctrl.onSelectChange = onSelectChange;
    ctrl.onCatChange = onCatChange;
    ctrl.info = info;
    /*ctrl.subCatQuerySearch = subCatQuerySearch;
    ctrl.countryQuerySearch = countryQuerySearch;
    ctrl.channelQuerySearch = channelQuerySearch;*/

    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize();

        loadMeta();

        //audit
        auditService.add(auditService.assets['ROI Query'], null, auditService.actions.View)
    }

    function bind() {
        ctrl.data = null;

        ctrl.request.categories = ctrl.category.toString();
        ctrl.request.subcategories = ctrl.subcategory.join(',');
        ctrl.request.countries = ctrl.country.join(',');
        ctrl.request.channels = ctrl.channel.join(',');

        roiApi.getQuery(ctrl.request).then(function (response) {
            ctrl.data = _data = response.data.data || [];
        }, function () {
            ctrl.data = [];
        });
    }

    function loadMeta() {
        roiApi.getMetaData().then(function (response) {
            var data = response.data.data || {};

            ctrl.categories = data.categories;
            ctrl.subcategories = data.subCategories;
            ctrl.countries = data.countries;
            ctrl.channels = data.channels;
        });
    }

    function filter() {
        ctrl.data = _.filter(_data, function (item) {
            return utilService.filter(item, ['category', 'subcategory', 'country', 'communicationChannel'], ctrl.search);
        });
    }

    function filterSubCat(item) {
        if (ctrl.category) {
            return item.catId === ctrl.category;
        }
        else
            return false;
    }

    function onSelectChange(item) {
        if (_.indexOf(ctrl[item], -1) >= 0)
            ctrl[item] = [-1];

        if (_.indexOf(ctrl[item], -2) >= 0)
            ctrl[item] = [-2];
    }

    function onCatChange() {
        if (ctrl.category === '-1')
            ctrl.subcategory = ['-1'];
    }

    /*function subCatQuerySearch(query) {
        var filterData = _.filter(_subcategories, function(item) { return (item.catId === ctrl.request.category); })

        return query ? _.filter(filterData, function(item) { return (item.name.indexOf(query) > -1); }) : filterData;
    }

    function countryQuerySearch(query) {
        return query ? _.filter(_countries, function(item) { return (item.name.indexOf(query) > -1); }) : _countries;
    }

    function channelQuerySearch(query) {
        return query ? _.filter(_channels, function(item) { return (item.name.indexOf(query) > -1); }) : _channels;
    }*/

    function info(e) {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'app/roi/roi-info.html',
            targetEvent: e,
            controller: RoiInfoController,
            controllerAs: 'ctrl',
            bindToController: true,
            fullscreen: true
        });
    }
}


RoiInfoController.$inject = ['$mdDialog'];

function RoiInfoController($mdDialog) {
    var ctrl = this;
    ctrl.close = function () { $mdDialog.hide(); }
}