//feedback.component.js
angular
  .module('dap.app.admin')
  .component("appAdminFeedback", {
    controller: AppAdminFeedbackController,
    templateUrl: 'app/admin/app/feedback/feedback.html'
  });

AppAdminFeedbackController.$inject = ['feedbackApi', 'authService', 'utilService', 'auditService', 'constants'];

function AppAdminFeedbackController(feedbackApi, authService, utilService, auditService, constants) {
  var
    ctrl = this;

  ctrl.$routerOnActivate = $routerOnActivate;
  ctrl.filter = filter;

  ////////////
  function $routerOnActivate() {
    //authorize
    authService.authorize(authService.roles.app_admin);

    bind();

    //audit
    auditService.add(auditService.assets['Portal Admin Feedback'], null, auditService.actions.View)
  }

  function bind() {
    ctrl.data = null;
    feedbackApi.get().then(function (response) {
      ctrl.data = response.data.data || [];
    });
  }

  function filter(item) {
    return utilService.filter(item, ['message', 'author', 'authorDisplayName'], ctrl.search);
  }
};

