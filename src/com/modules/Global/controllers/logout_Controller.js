//This is the Controller for the login process this process brings the service information (Login info)
//Then it takes it and sets the credentials and clears the credentials
'use strict';


angular.module('myApp.module.Global.Logout.Controller', ['ngRoute','myApp.module.Global.Authentication.Factory'])// jshint ignore:line


.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/logout', {
            controller: 'LogoutController',
            templateUrl: 'com/modules/Global/views/logout.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Logout',
            menuGroup: 'Login',
            description: 'This is the Description of the Logout page',
            keywords: 'Login,Authentication',
            breadcrumbList: [{view: '/',title:'Home'}]
      });
    }])

.controller('LogoutController',// jshint ignore:line
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
        //$location.path('/');
    }]);