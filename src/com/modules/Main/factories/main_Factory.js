//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Main.Home.Factory', [])// jshint ignore:line

.factory('MainFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Main Factory';
            service.message = 'This is the placeholder message';
        
         return service;
    }]);