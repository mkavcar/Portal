//feeds.component.js
angular
  .module('dap.feeds')
  .component("feeds", {
    controller: FeedsController,
    templateUrl: 'app/feeds/feeds.html'
  });

FeedsController.$inject = ['feedsApi', '$rootRouter', '$mdDialog', 'auditService'];

function FeedsController(feedsApi, $rootRouter, $mdDialog, auditService) {
  var
    ctrl = this;
  ctrl.feeds = null;
  ctrl.categories = null;
  ctrl.selectedCat0ID = 0;
  ctrl.selectedCat1ID = 0;
  ctrl.selectedFeed;

  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.filter = filter;
  ctrl.toggle = toggle;
  ctrl.selectedColor = selectedColor;
  ctrl.select = select;
  ctrl.info = info;


  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize();

    bind();

    //audit
    auditService.add(auditService.assets['Data Marketplace'], null, auditService.actions.View)
  }

  function bind() {
    ctrl.feeds = null;
    ctrl.categories = null;
    feedsApi.getAll().then(function (response) {
      ctrl.feeds = response.data.data.feeds || [];
      ctrl.categories = response.data.data.categories || [];
    });
  }

  function filter(item) {
    return feedsApi.filter(item, ctrl.selectedCat0ID, ctrl.selectedCat1ID, ctrl.search);
  }

  function toggle(category) {
    category.isExpanded = !(category.isExpanded === true);
  }

  function selectedColor(cat0ID, cat1ID) {
    if (cat1ID)
      return (ctrl.selectedCat1ID === cat1ID) ? 'primary-400' : 'background-300';
    else
      return (ctrl.selectedCat1ID === 0 && ctrl.selectedCat0ID === cat0ID) ? 'primary-400' : 'background-50';
  }

  function select(feed) {
    console.log('select');
  }

  function info(feed, ev) {
    ctrl.selectedFeed = feed;

    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'app/feeds/feedinfo.html',
      targetEvent: ev,
      fullscreen: true,
      clickOutsideToClose: true,
      controller: InfoDialogController,
      controllerAs: 'ctrl',
      bindToController: true,
      locals: { feed: feed }
    });
  }
};

InfoDialogController.$inject = ['$scope', '$mdDialog'];

function InfoDialogController($scope, $mdDialog) {
  var ctrl = this;

  ctrl.cancel = function () {
    $mdDialog.cancel();
  }
}