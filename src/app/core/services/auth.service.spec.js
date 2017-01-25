describe('authService', function() {
  var authServiceObj;
  
  //load module
  beforeEach(function() {
    module('dap.app');
  });
  
  //set up mock service object
  beforeEach(inject(function(authService) {
    authServiceObj = authService;
  }))

  it('should define methods', function() {
    expect(authServiceObj.isLoggedIn).toBeDefined()
    expect(authServiceObj.isLoggedIn).toEqual(jasmine.any(Function))
    expect(authServiceObj.getUser).toBeDefined()
    expect(authServiceObj.getUser).toEqual(jasmine.any(Function))
    expect(authServiceObj.login).toBeDefined()
    expect(authServiceObj.login).toEqual(jasmine.any(Function))
    expect(authServiceObj.logout).toBeDefined()
    expect(authServiceObj.logout).toEqual(jasmine.any(Function))
  });
});