'use strict';

angular.module('myApp.module.Global.400.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/400', {
            controller: '400Controller',
            templateUrl: 'com/modules/Global/views/400.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '400',
            description: 'This is the 400 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '400 Error'}]
      });
    }])


    .controller('400Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 400 error!';
    }]);