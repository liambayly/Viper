'use strict';

angular.module('myApp.module.Company.Home.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Global.Message.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
						controller: 'HomeController',
						templateUrl: 'com/modules/Company/views/home.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Welcome',
						menuGroup: 'Home',
						description: 'This is the Description of the Home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/',title:'Home'}]
			});
		}])


.controller('HomeController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'MessageFactory',
		function ($scope, $rootScope, $location, MessageFactory) {

			$scope.message = 'This is the Home page message from the controller';

			
			//This gets the Initial Error Message
			MessageFactory.getErrorMessage(function(dataResponse) {
					$scope.globalErrorMessage = dataResponse.data;
					if(dataResponse.data.Active === 'true'){
							 $location.path('/error');
					}
					$rootScope.globalErrorMessage = dataResponse.data;
			});

			//This gets the Maintenance  Message
			MessageFactory.getMaintenanceMessage(function(dataResponse) {
					$scope.globalMaintenanceMessage = dataResponse.data;
					$rootScope.globalMaintenanceMessage = dataResponse.data;
					if(dataResponse.data.Active === 'true'){
							 $location.path('/maintenance');
					}
			});

			
			//This gets the System  Message
			MessageFactory.getSystemMessage(function(dataResponse) {
					$scope.globalSystemMessage = dataResponse.data;
			});


		}]);
