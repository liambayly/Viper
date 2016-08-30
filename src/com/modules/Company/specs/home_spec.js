//This describes the test you are running and will be used when a test fails , this will display as the item where it fails, 
//I use a dot notation to know the location of the module I am testing 
describe('Unit: myApp.module.Company.Home.Controller', function() {
    
    //This is the module you are testing in this case we are looking at the about module which is comprised of everything within the module folder (services/Controllers)
    beforeEach(module('myApp.module.Company.Home.Controller'));
        //Here we declare what items are required for testing , in this case its a controller and the scope of variables that we will be testing. 
        var HomeController,
        scope;
    
        //Here we declare the controller and pass the rootscope and controller mock to it to allow it to find and test the controller in the module
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            HomeController = $controller('HomeController', {
                $scope: scope
            });
        }));
    
    
    
        //Now that we have declared what we are looking for we begin the test cases this are will house all the test cases for this module
    
        //First test we run is looking for the scope.message variable which is set in the controller and ensure that it is set and returning what we set it as. 
        it('Testing scope.message message is "This is the Home page message from the controller"', function () {
            expect(scope.message).toEqual("This is the Home page message from the controller");
        });
    
    
        //Second we test the route module, this allows us to ensure that the routing information is passing what we expect to see for the about route. 
        it('Testing the Route Information in the about Module',
        inject(function ($route) {

          expect($route.routes['/'].controller).toBe('HomeController');
          expect($route.routes['/'].templateUrl).toEqual('com/modules/Company/views/home.html');
          expect($route.routes['/'].hideMenus).toBe(false);
          expect($route.routes['/'].protectedArea).toBe(true);
          expect($route.routes['/'].title).toBe('Welcome');
          expect($route.routes['/'].description).toBe('This is the Description of the Home page');
          expect($route.routes['/'].keywords).toBe('Home,Homey');

        }));

});