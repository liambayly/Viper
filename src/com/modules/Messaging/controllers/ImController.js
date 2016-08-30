'use strict';

angular.module('myApp.module.Messaging.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Messaging.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/messaging', {
						controller: 'IMController',
						templateUrl: 'com/modules/Messaging/views/messaging.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Messaging Main',
						menuGroup: 'Home',
						description: 'This is The Messaging Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/messaging',title:'VIPER'},{view: '/messaging',title:'Message Main'}]
			});
		}])


.controller('IMController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'IMFactory',
		function ($scope, $rootScope, $location, IMFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = IMFactory.message;


		}]);
