
'use strict';

europaApp.directive('euJustGrungeLine',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euJustGrungeLine.html',
		controller : ['$scope','AdFactory', function($scope, AdFactory){
	        AdFactory.getVerticals(function(dataResponse) {
	            $scope.verticalBanners = dataResponse.data;

	            //setting url links to the banner objects
	            for (var index = 0; index < $scope.verticalBanners.length; index++) {
	            	/*
	            	*I used bannerid so we can change the name of the banner and not break anything
	            	*I placed the name of what it should be on the top of each if statement
	            	*It is requested that some of the links open new tabs so we need to include
	            	href target values as well. The links that are internal keep the urlTarget blank
	            	if we fill it with anything the single page app will refresh and load the full 
	            	app again.
					*/

	            	//'Where's Europaman' - 1534
	            	if($scope.verticalBanners[index].bannerid === 1534){
	            		$scope.verticalBanners[index].urlLink = 'https://www.europasports.com/europaman/index.cfm';
	            		$scope.verticalBanners[index].urlTarget='_blank';
	            	}

	            	//'Browse Gluten Free' - 1535
	            	else if($scope.verticalBanners[index].bannerid === 1535){
	            		$scope.verticalBanners[index].urlLink = '/productlist?glutenfree=1';
	            		$scope.verticalBanners[index].urlTarget='';
	            	}

	            	//'ISSN' - 1536
	            	else if($scope.verticalBanners[index].bannerid === 1536){
	            		$scope.verticalBanners[index].urlLink = 'http://www.sportsnutritionsociety.org/';
	            		$scope.verticalBanners[index].urlTarget='_blank';
	            	}

	            	//'Europa University' - 1537
	            	else if($scope.verticalBanners[index].bannerid === 1537){
	            		$scope.verticalBanners[index].urlLink = 'http://www.europauniversity.com/';
	            		$scope.verticalBanners[index].urlTarget='_blank';
	            	}

	            	//'Kool Stuff We Don't Sell' - 1538
	            	else if($scope.verticalBanners[index].bannerid === 1538){
	            		$scope.verticalBanners[index].urlLink = '/koolstuff';
	            		$scope.verticalBanners[index].urlTarget='';
	            	}
	            	else{
						$scope.verticalBanners[index].urlLink = '#';
						$scope.verticalBanners[index].urlTarget='_self';
	            	}

	            }
	        });
		}]
	});
}]);