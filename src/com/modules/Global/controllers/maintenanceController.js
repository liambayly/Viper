'use strict';

angular.module('myApp.module.Global.Maintenance.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/maintenance', {
            controller: 'maintenanceController',
            templateUrl: 'com/modules/Global/views/maintenance.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Maintenance Screen',
            menuGroup: 'Home',
            description: 'This is the Maintenance Screen',
            keywords: 'error,danger,thiserror',
            breadcrumbList: [{view: '/', title: 'Home'}, {view: '/maintenance', title: 'Maintenance'}]
      });
    }])


    .controller('maintenanceController', ['$scope', function($scope) {
        $scope.message = 'The System is in Maintenance Mode!';
    }]);
