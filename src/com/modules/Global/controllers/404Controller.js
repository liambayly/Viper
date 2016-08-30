'use strict';

angular.module('myApp.module.Global.404.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/404', {
            controller: '404Controller',
            templateUrl: 'com/modules/Global/views/404.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '404',
            description: 'This is the 404 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '404 Error'}]
      });
    }])


    .controller('404Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 404 error!';
    }]);