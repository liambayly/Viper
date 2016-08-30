
'use strict';

europaApp.directive('euEventsListings',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euEventsListings.html',
		controller : ['$scope','EventFactory', function($scope, EventFactory){
	        EventFactory.getFPEvents(function(dataResponse) {
	            $scope.FpEvents = dataResponse.data;
	        });
		}]
	});
}]);