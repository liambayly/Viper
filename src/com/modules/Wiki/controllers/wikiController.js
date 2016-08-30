'use strict';

angular.module('myApp.module.Wiki.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Wiki.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/wiki', {
						controller: 'WikiController',
						templateUrl: 'com/modules/Wiki/views/wiki.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Wiki Main',
						menuGroup: 'Home',
						description: 'This is The Wiki Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/wiki',title:'Wiki Main'}]
			});
		}])


.controller('WikiController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'WikiFactory',
		function ($scope, $rootScope, $location, WikiFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = WikiFactory.message;


		}]);
