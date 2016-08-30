 /*jshint ignore:start */

europaApp.directive("euProductSummary",function euProductSummaryDirective( ) {
                return({
                    restrict: "E",
                    templateUrl: '/com/directives/views/euProductSummary.html',
                    controller: 'euProductSummaryController',
                    scope: {
                    	data : '=',
                        spinner : '='
                    }
                });
})

.controller('euProductSummaryController', ['$scope','$rootScope','$filter','$location','$routeParams', 'FoundationApi', 'StoreFactory', 'CartFactory', 'WishlistFactory', function($scope,$rootScope,$filter,$location,$routeParams,FoundationApi,StoreFactory,CartFactory, WishlistFactory) {// jshint ignore:line
        $scope.cartItem = [
            {id:'0'},
            {qty:'0'},
            {name:'0'},
            {brand:'0'},
            {sc:'0'},
            {upc:'0'},
            {size:'0'},
            {flavor:'0'},
            {wholesalePrice:'0'},
            {unitPrice:'0'},
            {pic:'0'}
        ];
        $scope.nutrition = {};
        
        
        //Wishlist variables
        
        $scope.wishlist = [{id: 0},{name: ''},{namevalue: 'Wishlists'},{add:false},{create: false},{added: false},{button:false},{cartToWishList:false}];
        $scope.wishlist.id = 0;
        $scope.wishlist.name = '';
        $scope.wishlist.namevalue = 'Wishlists';
        $scope.wishlist.add = false;
        $scope.wishlist.create = false;
        $scope.wishlist.added = false;
        $scope.wishlist.button = false;
        $scope.wishlist.cartToWishList = false;
        $scope.wishlistItem = [];
        $scope.removeItemID = 0;
        
        //End the Wishlist Variables
        
        
        //Wishlist Functions
        
        
        WishlistFactory.list(function(dataResponse) {
            $scope.wishLists = dataResponse.data;
        });
        
        $scope.addItemToWishList = function(wishlistName, wishListID, productID, QTY){
            
            if($scope.checkSetWishList()){
                //resetting the values for the obj controlboard 
                $scope.wishlist.create = false;
                $scope.wishlist.added = true;
                //$scope.wishlist.id = 0;
                $scope.wishlist.namevalue = 'Wishlists';
                $scope.wishlist.button = true;
                //Adding item to the wishlist 
                WishlistFactory.addItem(wishlistName, wishListID, productID, QTY, function(dataResponse) {
                    $scope.cartItemAdd = dataResponse.data;
                    $rootScope.wishlistID = $scope.cartItemAdd[0].wishlistid;
                    $scope.wishlist.id = $scope.cartItemAdd[0].wishlistid;
                    //Regetting the list of wishlists incase a new one is added 
                    WishlistFactory.list(function(dataResponse) {
                        $scope.wishLists = dataResponse.data;
                    });
                });
                

            }
            
        };
        
        
        $scope.viewWishList = function(id){
          $scope.wishlist.id = id;
          $rootScope.wishlistID = id;
          $location.search( 'vendor', null );
          $location.search( 'id', null );
          $location.search( 'name', null );
          $location.search( 'type', null );
          $location.path('/wishlist');  
        };
        
        
        $scope.checkSetSelectWishList = function(){
          var tmpret = true;
            if($scope.wishlist.button === true){
                tmpret = false;
            }
            
            return tmpret;
        };
        
        $scope.setWishListID = function(id,name){
              $scope.wishlist.id = id;
              $scope.wishlist.name = name;
              $scope.wishlist.namevalue = name;
              $rootScope.wishlistID = id;
        };
        
        $scope.createNewWishList = function(){
            $scope.wishlist.create = true;
            $scope.wishlist.id = 0;
            $scope.wishlist.name = '+ Create New Wishlist';
            $scope.wishlist.namevalue = '+ Create New Wishlist';
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
            
            if($scope.wishlist.input === undefined && $scope.wishlist.namevalue === '+ Create New Wishlist'){
                tmpret = false;
            }
            
            if($scope.wishlist.input === '' && $scope.wishlist.namevalue === '+ Create New Wishlist'){
                tmpret = false;
            }
            
            if($scope.wishlist.input === null && $scope.wishlist.namevalue === '+ Create New Wishlist'){
                tmpret = false;
            }
            
            return tmpret;
        };
        
        
        //End the Wishlist Functions
        
        
        
        
        //----------setting functions-------------

        $scope.newProductCheck = function(date){
            var date1 = new Date($scope.getCurrentDate());
            var date2 = new Date(date);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var newProduct = false;
            if(diffDays <= 30){
                newProduct = true;
            }else{
                newProduct = false;
            }
            return newProduct;
        };
        
        $scope.getCurrentDate = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd;
            } 

            if(mm<10) {
                mm='0'+mm;
            }

            today = mm+'/'+dd+'/'+yyyy;
            return today;
        };
        
        $scope.checkAddToCart = function(userAuth,inStock,qty){
            var showButton = false;
            if(userAuth && inStock && qty){
                showButton = true;
            }
            return showButton;
        };
    
        
        
        $scope.addToCart = function(product){
            $scope.clearCartItem();
            $scope.setCartItem(product);
            
                    CartFactory.addToCart($scope.cartItem.id, $scope.cartItem.qty, $scope.cartItem.wholesalePrice, $scope.cartItem.unitPrice, function(dataResponse) {
                        $rootScope.globals.shoppingCart = dataResponse.data;
                    });
    
            return $rootScope.globals.shoppingCart;
        };
        
        $scope.clearCartItem = function(){

            $scope.cartItem.id = '';
            $scope.cartItem.qty = '';
            $scope.cartItem.name = '';
            $scope.cartItem.brand = '';
            $scope.cartItem.sc = '';
            $scope.cartItem.upc = '';
            $scope.cartItem.size = '';
            $scope.cartItem.flavor = '';
            $scope.cartItem.wholesalePrice = '';
            $scope.cartItem.unitPrice = '';
            $scope.pic = '';
            return $scope.cartItem;
        };
        
        $scope.setCartItem = function(obj){
          
            $scope.cartItem.id = obj.productid;
            $scope.cartItem.qty = obj.prodqty;
            $scope.cartItem.name = obj.productname;
            $scope.cartItem.brand = obj.vendorname;
            $scope.cartItem.sc = obj.stockcode;
            $scope.cartItem.upc = obj.upc;
            $scope.cartItem.size = obj.size;
            $scope.cartItem.flavor = obj.flavor;
            $scope.cartItem.wholesalePrice = obj.wholesaleprice;
            $scope.cartItem.unitPrice = obj.advancedpricing;
            $scope.cartItem.pic = obj.picfile;
            return $scope.cartItem;
        };
        //These are the Nutrition Functions for the listing page.********************************************************
        $scope.getNutrition = function (id){
            //The got Data is for the preloader
            $scope.nutrition = { gotData : false };
            StoreFactory.getProductDetails(id, function(dataResponse) {
                $scope.nutrition.gotData = true;
                $scope.nutrition.productDetails = dataResponse.data.PRODUCT[0];
                $scope.nutrition.nutrients = dataResponse.data.NUTRIENT;
                $scope.nutrition.proprietaryBlends = dataResponse.data.PROPRIETARYBLENDS[0];
                $scope.nutrition.flavorsList = dataResponse.data.FLAVORS;
                $scope.nutrition.sizeList = dataResponse.data.SIZES;
            });
        };
        
        
        
        
        
        //These are the wishlist functions
        
        
        $scope.addObjToWishList =  function(obj){
          $scope.wishListItem = obj;
        };
        
        //End the wishlist functions
        


        
        //These are the Compare Functions for the listing page.******************************************************** 
        
        $scope.changeCompareItems = function(obj){
            if(obj.compare === true){
                $rootScope.addItemToCompare(obj);
            }
            
            if(obj.compare === false){
                $rootScope.removeItemFromCompare(obj.productid);
            }
        };
        
        $scope.checkCheckCompareBoxes = function(id){
          var tmpRet = false;
            if($rootScope.comparedProducts[0].id === id){
                tmpRet = true;
            }
            if($rootScope.comparedProducts[1].id === id){
                tmpRet = true;
            }
            if($rootScope.comparedProducts[2].id === id){
                tmpRet = true;
            }
            return tmpRet;
        };

}]);

 /*jshint ignore:end */
