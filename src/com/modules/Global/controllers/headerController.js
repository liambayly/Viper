//This is the home controller that simply sets a message and returns it to the view.
'use strict';

angular.module('myApp.module.Global.Header.Controller', ['ngRoute', // jshint ignore:line
                                                         ])


.controller('HeaderController',// jshint ignore:line
    ['$scope', '$rootScope','$location', 'AuthenticationService', 
    function ($scope, $rootScope) {
        
      $scope.message = 'This is the Header Message';
      $rootScope.message = 'This is hte test rootscope message';
        
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    }]);