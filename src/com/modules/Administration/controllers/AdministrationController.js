'use strict';

angular.module('myApp.module.Administration.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Administration.Main.Factory',
                                                                                                                'myApp.module.Reporting.Graph.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/administration', {
						controller: 'AdminController',
						templateUrl: 'com/modules/Administration/views/administration.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Administration Main',
						menuGroup: 'Home',
						description: 'This is The Messaging Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/administration',title:'Administration Main'}]
			});
		}])


.controller('AdminController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'AdminFactory','GraphFactory',
		function ($scope, $rootScope, $location, AdminFactory,GraphFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = AdminFactory.message;

            $scope.chartType = 'bar';
	
	$scope.config = {
    title: 'Products',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };
	
	
	$scope.config1 = {
		labels: false,
		title: 'Products',
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 110,
		outerRadius: 100
	};

	$scope.config2 = {
		labels: false,
		title: 'HTML-enabled legend',
		legend: {
			display: true,
			htmlEnabled: true,
			position: 'right'
		},
		lineLegend: 'traditional'
	};

	
  //This is the Featured Products System
			GraphFactory.getGraphBanners(function(dataResponse) {
					$scope.data = dataResponse.graph[0];
			});
	
	
			GraphFactory.getGraphBanners2(function(dataResponse) {
					$scope.data1 = dataResponse.graph[0];
			});
	
			GraphFactory.getGraphBanners3(function(dataResponse) {
					$scope.data2 = dataResponse.graph[0];
			});
            
		}]);
