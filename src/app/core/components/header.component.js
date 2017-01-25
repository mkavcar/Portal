//header.component.js
angular
  .module('dap.core')
  .component("dapHeader", {
    controller: HeaderController,
    templateUrl: 'app/core/components/header.html'
});

HeaderController.$inject = ['$rootRouter', '$mdSidenav', '$timeout', 'authService'];

function HeaderController($rootRouter, $mdSidenav, $timeout, authService) {
  var 
    ctrl = this;
    ctrl.toggleSpin = true;
    ctrl.navigate = navigate;
    ctrl.toggleMainnav = toggleMainnav;
    ctrl.$onInit = $onInit;

  
  ////////////
  function navigate(component) {
    $rootRouter.navigate([component]);
  }

  function toggleMainnav() {
    if (authService.isLoggedIn()) {
      var sidenav = $mdSidenav('dapMainNav');

      if (sidenav) {
        if (!sidenav.isOpen())
          toggleIcon();

        sidenav.toggle();    
      }
    }
  }

  function $onInit() {
    $timeout(function() {
      if (authService.isLoggedIn()) {
        $mdSidenav('dapMainNav').onClose(function () {
          toggleIcon();
        });      
      }
    });    
  }

  function toggleIcon() {
    ctrl.toggleSpin = false;
    $timeout(function() {
      ctrl.toggleSpin = true;
    }, 100);
  }
};