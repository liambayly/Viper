//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Messaging.Main.Factory', [])// jshint ignore:line

.factory('IMFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Wiki Factory';

            service.message = 'This is the Wiki Message';
        
         return service;
    }]);