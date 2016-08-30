'use strict';

angular.module('myApp.module.Profile.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Profile.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/profile', {
						controller: 'ProfileController',
						templateUrl: 'com/modules/Profile/views/profile.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Profile Main',
						menuGroup: 'Home',
						description: 'This is The Profile Page System',
						keywords: 'Profile , Profile Main, Profile Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/profile',title:'Profile'}]
			});
		}])


.controller('ProfileController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'UserProfileFactory',
		function ($scope, $rootScope, $location, UserProfileFactory) {

			$scope.message = 'The Is the Profile Page';
            $rootScope.message = UserProfileFactory.message;


		}]);
