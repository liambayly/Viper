'use strict';

angular.module('myApp.module.Global.403.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/403', {
            controller: '403Controller',
            templateUrl: 'com/modules/Global/views/403.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '403',
            description: 'This is the 403 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '403 Error'}]
      });
    }])


    .controller('403Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 403 error!';
    }]);