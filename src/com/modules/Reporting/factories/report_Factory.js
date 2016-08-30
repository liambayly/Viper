//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Reporting.Main.Factory', [])// jshint ignore:line

.factory('ReportFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Report Factory';

            service.message = 'This is the Report Message';
        
         return service;
    }]);