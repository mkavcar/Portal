//roi-dashboard.component.js
angular
    .module('dap.roi')
    .component("roiDashboard", {
        controller: RoiDashboardController,
        templateUrl: 'app/roi/roi-dashboard.html'
    });

RoiDashboardController.$inject = ['authService', 'roiApi', 'auditService'];

function RoiDashboardController(authService, roiApi, auditService) {
    var
        ctrl = this;

    ctrl.chartColors = ['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B', '#00695C', '#004D40'];
    ctrl.roiByCountry = ctrl.roiByCountryChartData = null;
    ctrl.roiByChannel = ctrl.roiByChannelChartData = null;
    ctrl.roiByCategory = ctrl.roiByCategoryChartData = null;
    ctrl.roiBySubCategory = ctrl.roiBySubCategoryChartData = null;

    ctrl.$routerOnActivate = $routerOnActivate;


    ////////////
    function $routerOnActivate() {
        //authorize
        authService.authorize();

        bind();

        //audit
        auditService.add(auditService.assets['ROI Dashboard'], null, auditService.actions.View)
    }

    function bind() {
        var filteredData;

        roiApi.getAggregated(1).then(function (response) {
            ctrl.roiByCountry = response.data.data || [];

            filteredData = _.chain(ctrl.roiByCountry).orderBy(['averageROI'], ['desc']).slice(0, 10).value();
            ctrl.roiByCountryChartLabels = _.map(filteredData, 'name');
            ctrl.roiByCountryChartData = _.map(filteredData, 'averageROI');
        });

        roiApi.getAggregated(2).then(function (response) {
            ctrl.roiByChannel = response.data.data || [];

            filteredData = _.chain(ctrl.roiByChannel).orderBy(['averageROI'], ['desc']).slice(0, 10).value();
            ctrl.roiByChannelChartLabels = _.map(filteredData, 'name');
            ctrl.roiByChannelChartData = _.map(filteredData, 'averageROI');
        });

        roiApi.getAggregated(3).then(function (response) {
            ctrl.roiByCategory = response.data.data || [];

            filteredData = _.chain(ctrl.roiByCategory).orderBy(['averageROI'], ['desc']).slice(0, 10).value();
            ctrl.roiByCategoryChartLabels = _.map(filteredData, 'name');
            ctrl.roiByCategoryChartData = _.map(filteredData, 'averageROI');
        });

        roiApi.getAggregated(4).then(function (response) {
            ctrl.roiBySubCategory = response.data.data || [];

            filteredData = _.chain(ctrl.roiBySubCategory).orderBy(['averageROI'], ['desc']).slice(0, 10).value();
            ctrl.roiBySubCategoryChartLabels = _.map(filteredData, 'name');
            ctrl.roiBySubCategoryChartData = _.map(filteredData, 'averageROI');
        });
    }
};
