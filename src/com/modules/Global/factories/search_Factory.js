//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Search.Factory', [])// jshint ignore:line

.factory('SearchFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Search Factory';

            service.getResults = function (searchText,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/results.json?searchStr='+searchText;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getCategoryProducts = function (id,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/read.json?categoryid='+id;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getBrandProducts = function (id,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/read.json?vendorid='+id;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
         return service;
    }]);