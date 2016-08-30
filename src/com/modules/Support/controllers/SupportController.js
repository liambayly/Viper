'use strict';

angular.module('myApp.module.Support.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Support.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/support', {
						controller: 'SupportController',
						templateUrl: 'com/modules/Support/views/support.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Support Main',
						menuGroup: 'Home',
						description: 'This is The Support Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/support',title:'Support Main'}]
			});
		}])


.controller('SupportController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'SupportFactory',
		function ($scope, $rootScope, $location, SupportFactory) {

			$scope.message = 'The Is the Support Page';
            $rootScope.message = SupportFactory.message;


		}]);
