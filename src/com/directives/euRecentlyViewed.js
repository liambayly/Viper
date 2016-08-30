
'use strict';

europaApp.directive('euRecentlyViewed',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euRecentlyViewed.html',
		controller : ['$scope','$rootScope','StoreFactory', function($scope, $rootScope, StoreFactory){
	        
            if($rootScope.authkey !== 0){
                    StoreFactory.getRecentlyViewed(function(dataResponse) {
	                   $rootScope.recentlyViewed = dataResponse.data;
                    console.log($scope.recentlyViewed);
	        });   
            }
            
		}]
	});
}]);