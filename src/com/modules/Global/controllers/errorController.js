'use strict';

angular.module('myApp.module.Global.Error.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/error', {
            controller: 'errorController',
            templateUrl: 'com/modules/Global/views/error.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Error Screen',
            menuGroup: 'Error',
            description: 'This is the Error Screen',
            keywords: 'error,danger,thiserror',
            breadcrumbList: [{view: '/', title: 'Home'}, {view: '/error', title: 'There Has been an Error'}]
      });
    }])


    .controller('errorController', ['$scope', function($scope) {
        $scope.message = 'There has been an error!';
    }]);