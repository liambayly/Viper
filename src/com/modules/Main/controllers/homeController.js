'use strict';

angular.module('myApp.module.Main.Home.Controller', ['ngRoute', // jshint ignore:line
												     'myApp.module.Main.Home.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/main', {
						controller: 'MainController',
						templateUrl: 'com/modules/Main/views/home.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Main Dashboard',
						menuGroup: 'Home',
						description: 'This is the Description of the Home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/',title:'VIPER'},{view: '/main',title:'Main Dashboard'}]
			});
		}])


.controller('MainController',// jshint ignore:line
		['$scope', '$rootScope', 'MainFactory',
		function ($scope, $rootScope, MainFactory) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.tmp = MainFactory.message;
            
            //Calendar Variables
            $scope.calendarView = 'month';
            $scope.calendarDate = new Date();
            
            //Calendar Events
            $scope.events = [
              {
                title: 'My event title', // The title of the event
                type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                startsAt: new Date(2013,5,1,1), // A javascript date object for when the event starts
                endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
                editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
                deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                draggable: true, //Allow an event to be dragged and dropped
                resizable: true, //Allow an event to be resizable
                incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
              }
            ];

			
			


		}]);
