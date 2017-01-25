//user.component.js
angular
  .module('dap.feeds.admin')
  .component("feedsUser", {
    controller: FeedsUserController,
    templateUrl: 'app/admin/feeds/users/user.html'
});

FeedsUserController.$inject = ['feedsUserApi', '$rootRouter'];
  
function FeedsUserController(feedsUserApi, $rootRouter) {
  var 
    ctrl = this,
    pageSize = 20,
    data = [];    

  ctrl.$routerOnActivate = bind;
  ctrl.onSearchChange = bind;
  ctrl.edit = edit;

  /*ctrl.gridOptions = {    
    sortable: true,
    pageable: true,
    columns: [{
        field: "firstName",
        title: "Name",
        template: "#: firstName # #: lastName #"
        },{
        field: "email",
        title: "Email"        
        },{
        field: "agency",
        title: "Agency",
        width: "120px"
        },{
        field: "country",
        title: "Country"
        },{
        field: "role",
        title: "Role",
        width: "120px"
        },{
        title: "Edit",
        width: "80px",
        template: '<md-button ng-click="$ctrl.edit(\'#=id#\')" style="min-width:1%;margin:0;padding:0" class="md-icon-button md-primary"><md-icon class="material-icons">create</md-icon></md-button>'
    }]};*/
  
  ////////////
  function bind() {
    feedsUserApi.getAll().then(function (response) {    
      /*var dataSource = new kendo.data.DataSource({ 
          data: userApi.filter(data, ctrl.search), 
          pageSize: pageSize});            
      
      ctrl.grid.setDataSource(dataSource);*/
    });
  }

  function edit(id) {
    console.log('edit item:' + id);
  }
};
