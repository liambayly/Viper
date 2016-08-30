
'use strict';


/*

This directive just augmenting a url given to it to include the following
pageSize (Number), sortType (Number), pageNumber (Number)

This directive does use the config results approch

---parent controller---
$scope.bar = {
			config : {
				url : {}
			},
			result : {
				url : {}
			}
        };
---parent html----

<eu-paginate link="directive.euPaginate">
	...html that is within the two bars...
</eu-paginate>
*/

europaApp.directive('euPaginate', function() {// jshint ignore:line
	return {
		restrict: 'E',
		controller: 'euPaginationController',
		templateUrl: '/com/directives/views/euPaginate.html',
		transclude : true,
		scope : {
			link : '='
		}
	};
})
.controller('euPaginationController', ['$scope','$rootScope', '$routeParams', 'StoreFactory', '$location', function ($scope, $rootScope, $routeParams,StoreFactory, $location) { // jshint ignore:line

	//getting default or previous values

	//decalring and setting to previous if possible 
	$scope.sortConfig = {
		page : new Number($routeParams.pageNumber)+0 , //jshint ignore:line
		sort : $routeParams.sortOrder,
		show : $routeParams.pageSize,
	};
	//setting defaults
	if(!$scope.sortConfig.page){
		$scope.sortConfig.page = 1;
		$location.search('pageNumber', 1);
	}
	if(!$scope.sortConfig.sort){
		$scope.sortConfig.sort = 0;
		$location.search('sortOrder', 0);
	}
	if(!$scope.sortConfig.show){
		$scope.sortConfig.show = 20;
		$location.search('pageSize', 20);
	}

	//As it was easier for the server to have the sort as an index number We created this array which the index number matches to
	//DO NOT CHANGE THE ORDER OF THE SORTLIB ARRAY AS IT MATCHES THE LIST ON THE SERVICE LAYER
	$scope.sortLib = ['A to Z', 'Z to A', 'Newest', 'Price Low to High', 'Price High to Low'];
	$scope.sortList = [];
	$scope.textFieldForPageNumber = $scope.sortConfig.page;

	for (var i = 0; i < $scope.link.config.sort.length; i++) {
		$scope.sortList.push($scope.sortLib[$scope.link.config.sort[i]]);
	}

	$scope.setSort = function(index){
		$scope.sortConfig.sort = index;
		$location.search('sortOrder', index);
	};

	$scope.setShow = function(value){
		$scope.sortConfig.show = value;
		$location.search('pageSize', value);
		$scope.setPage($scope.sortConfig.page);
	};

	$scope.setPage = function(index){
		var possibleRange = $scope.getItemRange(index);
		var newIndex = setPageLimits(index, possibleRange[0], possibleRange[1]);
		$scope.sortConfig.page = newIndex;
		$location.search('pageNumber', newIndex);
		$scope.textFieldForPageNumber = newIndex;
	};
	$scope.link.setPage = $scope.setPage;

	var setPageLimits = function(index, min){// jshint ignore:line
		if(min <= 1){
			index = 1;
		}else if (min > $scope.link.config.numberOfProducts){
			index--;
			var newMinMax = $scope.getItemRange(index);
			index = setPageLimits(index, newMinMax[0], newMinMax[1]);
		}
		return index;
	};

	$scope.getItemRange = function(index){
		index = index || $scope.sortConfig.page;
		var min = index * $scope.sortConfig.show - $scope.sortConfig.show + 1;
		var max = index * $scope.sortConfig.show;
		if (max > $scope.link.config.numberOfProducts){
			max = $scope.link.config.numberOfProducts;
		}
		return [min, max];
	};
	$scope.getItemRangeText = function(){
		var array = $scope.getItemRange();
		return array[0] + '-' + array[1];
	};

	$scope.getMaxPageCount = function(){
		return Math.ceil($scope.link.config.numberOfProducts / $scope.sortConfig.show);
	};
	$scope.$watchCollection('sortConfig', function sortConfigWatcher(){
        $scope.link.result.url = StoreFactory.getProductListUrlBySortConfiguration($scope.sortConfig);
    });

}]);//jshint ignore:line





