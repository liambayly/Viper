
//Directive to apply currency filter to prices if the user is logged in
/*
USAGE :

Assuming the following:
	product.price = 12.43;
	$scope.authFailedMsg = 'N/A';


HTML:
	<p eu-price="{{product.price}}"></p>

should product : 
	if auth passes:
		<p eu-price="12.43">12.43</p>
	if auth fails:
		<p eu-price="12.43">N/A</p>
*/


'use strict';

europaApp.directive('euPrice', function() {// jshint ignore:line
	return ({
	    restrict: 'A',
	    //get data from the attribute
	    scope: {
	    	//one way data binding with the attr price and sets the variable to the scope
	    	euPrice : '@',
	    	euMessage : '@'
	    },
        controller: ['$scope', '$filter', '$attrs','$rootScope', function($scope, $filter, $attrs, $rootScope) {
        	
        	//holds the price so it can be called as we will overwrite it.
        	$scope.price = $scope.euPrice;
        	//setting a auth failed message
        	$scope.euMessage = $scope.euMessage || '';

        	var changePrice = function(){
	        	//If the auth is good set the currency filter to the price. If it fails then set it to the fail message.
	        	if($rootScope.globals.currentUser !== undefined && $rootScope.globals.currentUser.authkey){
	        		//if authentication is good overwrite it with the held $scope.price value
	        		$attrs.$set('euPrice', $filter('currency')($scope.price));
	        	}else{
	        		$attrs.$set('euPrice', $scope.euMessage);
	        	}
        	};
        	//first call
        	changePrice();
        	//watch if the auth changes
        	$rootScope.$watch('globals.currentUser', changePrice);
        	
	    }],
	    templateUrl: '/com/directives/views/euPrice.html'
	});
});
