//This is the Controller for the login process this process brings the service information (Login info)
//Then it takes it and sets the credentials and clears the credentials
'use strict';


angular.module('myApp.module.Global.Authentication.Controller', ['ngRoute',// jshint ignore:line
                                                                 'myApp.module.Global.Authentication.Factory'])


.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', {
            controller: 'LoginController',
            templateUrl: 'com/modules/Global/views/login.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Login',
            menuGroup: 'Login',
            description: 'This is the Description of the Login page',
            keywords: 'Login,Authentication',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/login', title: 'Login Main'}]
      });
    }])

.controller('LoginController',// jshint ignore:line
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        //AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, $scope.rememberme, function(response) {
                
                $scope.user = response.data[0];
                
                if($scope.user.isauth) {
                    $rootScope.authkey = $scope.user.authkey;
                    $rootScope.salesRepId = $scope.user.salesrepid;
                    $rootScope.userEmail = $scope.user.email;
                    AuthenticationService.SetCredentials($scope.user, $scope.rememberme);
                    
                    $scope.username = '';
                    $scope.password = '';
                    $location.path('/main');
                    
                }else {
                    $rootScope.loginErrorFlag = true;
                    $rootScope.loginError = $scope.user.retmessage;
                    $scope.dataLoading = false;
                }
                
            });
            
            
            
            return $rootScope;
        };
        
        $scope.logout = function () {
            
            AuthenticationService.ClearCredentials();
            console.log('LOGGED OUT');
			//$location.path('/loginPage');
        };
    }]);