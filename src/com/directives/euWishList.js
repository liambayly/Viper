
'use strict';

europaApp.directive('euWishList',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euWishList.html',
		controller : ['$scope','WishlistFactory', function($scope, WishlistFactory){
	        
            $scope.wishlist = [{id: 0},{name: ''},{namevalue: 'Wishlists'},{add:false},{create: false},{added: false},{button:false}];
            $scope.wishlist.id = 0;
            $scope.wishlist.name = '';
            $scope.wishlist.namevalue = 'Wishlists';
            $scope.wishlist.add = false;
            $scope.wishlist.create = false;
            $scope.wishlist.added = false;
            $scope.wishlist.button = false;
            $scope.wishlistItem = [];
            
            
            
        WishlistFactory.listWishlists(function(dataResponse) {
                $scope.wishLists = dataResponse.data;
            });
            
        
            
        $scope.continueShopping = function(){
          $scope.wishlist.create = false;
          $scope.wishlist.added = false;
          $scope.wishlist.name = '';
          $scope.wishlist.namevalue = 'Wishlists';
          $scope.wishlist.button = false;
        };
        
        
        $scope.addItemToWishList = function(){
            
            if($scope.checkSetWishList()){
                $scope.wishlist.create = false;
                $scope.wishlist.added = true;
                $scope.wishlist.id = 0;
                $scope.wishlist.name = 'Wishlists';
                $scope.wishlist.button = true;
            }
            
        };
        
        
        $scope.addCartToWishlist = function(){
            $scope.wishlist.add = true;
            $scope.wishlist.create = false;
        };
        
        
        $scope.setWishListID = function(id,name){
              $scope.wishlist.id = id;
              $scope.wishlist.name = name;
              $scope.wishlist.namevalue = name;
        };
        
        
        $scope.createNewWishList = function(){
            $scope.wishlist.create = true;
            $scope.wishlist.id = 0;
            $scope.wishlist.name = '+ Create New Wishlist';
        };
        
        
        $scope.changeWishListName = function(val){
            $scope.wishlist.name = val;
        };
        
        
        $scope.checkSetWishList = function(){
          var tmpret = true;
            if($scope.wishlist.namevalue === 'Wishlists'){
                tmpret = false;
            }
            
            if($scope.wishlist.name === 'Wishlists'){
                tmpret = false;
            }
            
            if($scope.wishlist.name === ''){
                tmpret = false;
            }
            
            return tmpret;
        };
        
        $scope.addObjToWishList = function(obj){
            $scope.wishlistItem = obj;
            console.log($scope.wishlistItem);
        };
            
            
		}]
	});
}]);