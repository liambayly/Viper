//This is the paginate directive , this directive also pulls a template to show the pagination bar 
//with a few variables this directive will control pagination on the specified page, this is an attribute
//restriction so you can use it like this <span paginate></span> and by setting currPage and pageSize (number of items per page)
//this will show and paginate through items on the page . view the events.html for a full example of it. 
'use strict';

//This is the directive specification pulling in the view template and restricting the use of the directive. 
europaApp.directive('paginate', function() {// jshint ignore:line
	return {
		restrict: 'A',
		controller: 'paginationController',
		templateUrl: '/com/directives/views/paginate.html'
	};
});


//This is the filter that filters the information on the ng-repeat to show only the items per page. 
europaApp.filter('pagination', function(){// jshint ignore:line
	return function(input, start){
		start =+ start;
		//return input.slice(start);
	};
	
});


//This is the controller with functions that are specific to the pagination, because some of those functions are global they have been added into the 
//application wide scope for use in the application. if you need to debug them you can do that in the app.js but they should be working fine and not require 
//editing 
europaApp.controller('paginationController', ['$scope','$rootScope', function ($scope,$rootScope) { // jshint ignore:line
		
		//This function will calculate the number of pages based on pageSize by dividing the data by it. 
		//This is used to tell you how many pages total are going to be displayed 
		//This function checks the total pages to see if you have gone beyond the beginning or end allowing you to disable the prev and next button

		$scope.pageNumber = 1;
		
		//This updates outside sources such as the rootScope
		$scope.$watch('pageNumber', $scope.update);
		$rootScope.$watch('pageSize', function(){
			//This will reset the page number to 1 when the user changed the amount shown on each page.
			$scope.pageNumber = 1;
			$scope.update(1, 1);
		});

		$scope.update = function(newValue){
			$scope.pageNumber = Number.parseInt($scope.pageNumber);
			if($scope.pageNumber > $scope.pagPageCount($scope.dataList,$scope.pageSize) ){
				$scope.pageNumber = $scope.pagPageCount($scope.dataList,$scope.pageSize);
			}
			if(!$scope.pageNumber || $scope.pageNumber < 1){
				$scope.pageNumber = 1;
			}
			$rootScope.pstart =  $rootScope.pageSize * (newValue - 1) + 1;
			$rootScope.pend =  $rootScope.pageSize * newValue;
			$rootScope.curPage = newValue - 1;
			return $rootScope.curPage;
		};

		$scope.numberOfPages = function(dataList,pageSize) {
			return Math.ceil(dataList.length / pageSize);
		};
		
		//This gives you the PageCount minus one to show the pages on the pagination
		$scope.pagPageCount = function(dataList,pageSize) {
			return Math.ceil(dataList.length / pageSize);
		};
		
		$scope.getCurrPage = function(){
			return $rootScope.curPage + 1;
		};
		$scope.addPageNumberBy = function(value){
			$scope.pageNumber+=value;
			return $scope.pageNumber;
		};
		

//-----------------------

		$scope.checkTotalPages = function(thisPage,dataList,pageSize) {
			var tmpTotal = Math.ceil(dataList.length / pageSize);
			var tmpReturn = false;
				if(thisPage <= tmpTotal){
					tmpReturn = true;
				}
			return tmpReturn;
		};
		
		$scope.checkBeginningPage = function(page) {
			 var tmpret = true;
			if(page <= 0){
				   tmpret = false;
			}
			return tmpret;
		};
		
		//This tells you wether you are on the current page , allowing you to activate the page number on pagination 
		$scope.isCurrentPage = function(thisPage) {
			var tmpReturn = false;
			if (thisPage === $rootScope.curPage){
				tmpReturn = true;   
			}
			return tmpReturn;
		};
		
		$scope.showPage = function(ind){
			var tmpRet = false;
			if(ind >=5){
				tmpRet = true;
			}else{
				tmpRet = false;
			}
			return tmpRet;
		};

		$scope.SetElipses = function(){
			if(!$scope.showElipses){
			   $scope.showElipses = true;
			}
		};
		
		$scope.setPaginationClass = function(tmp){
			var tmpClass = '';
		  if(tmp){
			  tmpClass = 'pagination__link pagination--current';
		  }else{
			  tmpClass = 'pagination__link'; 
		  }
			return tmpClass;
		};
		
	}]);


