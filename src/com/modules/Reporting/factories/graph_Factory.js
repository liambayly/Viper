//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Reporting.Graph.Factory', [])// jshint ignore:line

.factory('GraphFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Graph Factory';
        
        
        
            service.getGraphBanners = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph1.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
		
			service.getGraphBanners2 = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph2.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
		
			service.getGraphBanners3 = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph3.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
  
        
         return service;
    }]);