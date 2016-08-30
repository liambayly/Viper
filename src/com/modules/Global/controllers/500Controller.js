'use strict';

angular.module('myApp.module.Global.500.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/500', {
            controller: '500Controller',
            templateUrl: 'com/modules/Global/views/404.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '500',
            description: 'This is the 500 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '500 Error'}]
      });
    }])


    .controller('500Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 500 error!';
    }]);