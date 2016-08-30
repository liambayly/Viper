 /*jshint ignore:start */

europaApp.directive("euProductFilter",function euProductFilterDirective( ) {
                return({
                    restrict: "E",
                    templateUrl: '/com/directives/views/euProductFilter.html',
                    controller: 'euProductFilterController',
                    scope: {
                    	link : '='
                    }
                });
})

.controller('euProductFilterController',// jshint ignore:line
['$scope','$rootScope', 'StoreFactory', '$routeParams', '$location', function ($scope, $rootScope, StoreFactory, $routeParams, $location) {// jshint ignore:line

	$scope.serviceCall = $scope.link.config.serviceCall || StoreFactory.refreshProductFilters;
	$scope.acceptOnlyServiceCallWithId = 0;
	$scope.serviceCallOptions = {
		discontinued : $routeParams.discontinued || 0,
        newproducts : $routeParams.newproducts || 0,
        glutenfree : $routeParams.glutenfree || 0,
        vendor: $routeParams.vendor || $routeParams.Brand || 0,
        category: $routeParams.category || 0,
        size: $routeParams.size || 0,
        flavor: $routeParams.flavor || 0,
        price: $routeParams.price || 0,
        specials: $routeParams.specials || 0,
        product: $routeParams.product || 0,
        baseUrlParameters: $scope.link.config.baseUrlParameters
	}

	if($routeParams.type && $routeParams.type.toLowerCase() === 'category'){
		$scope.serviceCallOptions.category = $routeParams.id;
	}else if($routeParams.type === 'vendor' || $routeParams.type === 'Brand'){
		$scope.serviceCallOptions.vendor = $routeParams.id;
	}


	//These is the list of all filters available
	$scope.filters = {
		brand : {
			//text is the Text that is shown on the filter by dropdown bar
			text : 'Brand',
			//This sis the type of filter it is
			type : 'dropdown',
			//This is the active filter if no active filter it should be a falsy value
			active : $routeParams.vendorActive || '',
			//link is the value expected in the scope.link variable that the controller that calls this directive will have
			link : 'brand',
			//showOn is the controller for when the drop down for this filter is shown
			showOn : 'brand',
			//data is the list of data needed by this filter. Normally it stores the list or available filter options given by the server
			data : [],
			//the variable name from the service call shown in the downdrop list
			showValue : 'vendorname',
			//set is what happens when you set the filter
			set : function (item){
				$scope.serviceCallOptions.vendor = item.vendorid;
				$scope.filters.brand.active = item.vendorname;
				$location.search('vendor', item.vendorid);
				$location.search('vendorActive', item.vendorname);
				$scope.activateDropdown();
				makeServiceCall();
			},
			//removes the filter
			remove : function(item){
				$scope.serviceCallOptions.vendor = 0;
				$location.search('vendor', null);
				$location.search('vendorActive', null);
				$scope.filters.brand.active = '';
				makeServiceCall();
			}
		},
		category : {
			text : 'Category',
			type : 'dropdown',
			active : $routeParams.categoryActive || '',
			link : 'category',
			showOn : 'category',
			data : [],
			showValue : 'categoryname',
			set : function (item){
				$scope.serviceCallOptions.category = item.primarycategoryid;
				$scope.filters.category.active = item.categoryname;
				$scope.activateDropdown();
				$location.search('category', item.primarycategoryid);
				$location.search('categoryActive', item.categoryname);
				makeServiceCall();
			},
			remove : function(item){
				$scope.serviceCallOptions.category = 0;
				$scope.filters.category.active = '';
				$location.search('category', null);
				$location.search('categoryActive', null);
				makeServiceCall();
			}
		},
		flavor : {
			text : 'Flavor',
			type : 'dropdown',
			active : $routeParams.flavorActive || '',
			link : 'flavor',
			showOn : 'flavor',
			data : [],
			showValue : 'flavor',
			set : function (item){
				$scope.serviceCallOptions.flavor = item.flavor;
				$scope.filters.flavor.active = item.flavor;
				$scope.activateDropdown();
				$location.search('flavor', item.flavor);
				$location.search('flavorActive', item.flavor);
				makeServiceCall();
			},
			remove : function(item){
				$scope.serviceCallOptions.flavor = 0;
				$scope.filters.flavor.active = '';
				$location.search('flavor', null);
				$location.search('flavorActive', null);
				makeServiceCall();
			}
		},
		product : {
			text : 'Product',
			type : 'dropdown',
			active : $routeParams.productActive || '',
			link : 'product',
			showOn : 'product',
			data : [],
			showValue : 'productname',
			set : function (item){
				$scope.serviceCallOptions.product = item.productname;
				$scope.filters.product.active = item.productname
				$scope.activateDropdown();
				$location.search('product', item.productname);
				$location.search('productActive', item.productname);
				makeServiceCall();
			},
			remove : function(item){
				$scope.serviceCallOptions.product = 0;
				$scope.filters.product.active = '';
				$location.search('product', null);
				$location.search('productActive', null);
				makeServiceCall();
			}
		},
		specialsOnly : {
			text : 'View Only Specials',
			type : 'selector',
			checked : !!($routeParams.specialsOnly) || false,
			count : 0,
			set : function (model){
				if(model){
					$scope.serviceCallOptions.specials = 1;
					$location.search('specialsOnly', 1);
				}else{
					$scope.serviceCallOptions.specials = 0;
					$location.search('specialsOnly', null);
				}
				makeServiceCall();
			}
		}
	};
	//this converts the users filters = ['brand', 'category'] to the filter objects and places them into the activeFilters object
	$scope.activeFilters = [];
	var listOfNames = $scope.link.config.filters;
	for (var nameIndex = 0; nameIndex<listOfNames.length; nameIndex++){
		$scope.activeFilters.push($scope.filters[listOfNames[nameIndex]])
	}

	var fillFilterData = function(data){
		data = data || [];
		$scope.filters.flavor.data = data.FLAVORFILTER || 0;
		$scope.filters.category.data = data.PRIMARYCATEGORYFILTER || 0;
		$scope.filters.product.data = data.PRODUCTLINEFILTER || 0;
		$scope.filters.brand.data = data.VENDORFILTER || 0;
		$scope.filters.specialsOnly.count = data.SPECIALSCOUNT || 0;
	}


	//declare and call the service call
	//This ID is to prevent async data crossing with multiple calls happening at the same time
    var makeServiceCall = function(){
    	//set the id to a random number
    	$scope.acceptOnlyServiceCallWithId = Math.random();
    	//this should make the filters go gray until new data comes
    	for (var filter in $scope.filters) {
    		$scope.filters[filter].data = [];
    		$scope.filters[filter].count = 0;
    	};
    	//getting data from the service call
	    $scope.serviceCall(function(dataResponse,id) {
	    	//If the id for the call is what we are looking for apply the changes
	    	if($scope.acceptOnlyServiceCallWithId === id){
	    		fillFilterData(dataResponse.data);
	    		$scope.acceptOnlyServiceCallWithId = 0;
			}
	    }, $scope.serviceCallOptions, $scope.acceptOnlyServiceCallWithId);

	    //This will only get the url String and not make a service call
	    $scope.link.results = $scope.serviceCallOptions;
	}



    $scope.activateDropdown = function(item){
        if($scope.activeDropdown === item){
            $scope.activeDropdown = undefined;
        }else{
            $scope.activeDropdown = item;
        }
    };

	makeServiceCall();

}]);

/* jshint ignore:end */