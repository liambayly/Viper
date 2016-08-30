//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Profile.Main.Factory', [])// jshint ignore:line

.factory('UserProfileFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Profile Factory';

            service.message = 'This is the Profile Message';
        
         return service;
    }]);