//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Message.Factory', [])// jshint ignore:line

.factory('MessageFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Message Factory';

            service.getErrorMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getError.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
        
        
            service.getMaintenanceMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getMaintenance.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getSystemMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getSystem.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
         return service;
    }]);