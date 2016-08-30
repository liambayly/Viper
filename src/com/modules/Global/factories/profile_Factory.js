//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Profile.Factory', [])// jshint ignore:line

.factory('ProfileFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Profile Factory';

            service.getProfile = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/config/profile.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
						console.log('THe profile information was not set you need to ensure that you have a /public/config/profile.json file , if you do not this is required to run the application');
                    });
            };
        
         return service;
    }]);