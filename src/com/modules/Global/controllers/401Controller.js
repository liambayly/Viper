'use strict';

angular.module('myApp.module.Global.401.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/401', {
            controller: '401Controller',
            templateUrl: 'com/modules/Global/views/401.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '401',
            description: 'This is the 401 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '401 Error'}]
      });
    }])


    .controller('401Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 401 error!';
    }]);