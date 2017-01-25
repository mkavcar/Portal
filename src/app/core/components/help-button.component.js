//help-button.component.js
angular
  .module('dap.core')
  .component("dapHelpButton", {
    controller: HelpButtonController,
    templateUrl: 'app/core/components/help-button.html'
});

HelpButtonController.$inject = ['authService', '$mdDialog'];

function HelpButtonController(authService, $mdDialog) {
  var ctrl = this;    
    ctrl.feedback = feedback;
  
  ////////////
  function feedback(e) {
    $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'app/core/components/feedback.html',
        controller: FeedbackController,
        targetEvent: e,
        fullscreen: true
      });
  }
};

FeedbackController.$inject = ['$scope', '$mdDialog', 'feedbackApi', 'utilService'];

function FeedbackController($scope, $mdDialog, feedbackApi, utilService) {
  $scope.close = function() {
    $mdDialog.hide();
  }

  $scope.send = function(message) {
    feedbackApi.add(message).then(function() {
      utilService.showSuccessToast('Your feedback was successfully sent!');
      $mdDialog.hide();
    }, function () {
      utilService.showErrorToast('An error occured tyring to send feedback. Please try again or contact support.');
    });
  }
}