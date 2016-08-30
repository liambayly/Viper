

'use strict';

europaApp.directive('onAuth', function() { //jshint ignore:line
	return ({

        restrict: 'A',

        scope : {},
        
        link: function($scope, $element){ 
        	var getAuthKey = function(){
        		try{
        			return $scope.rootScope.globals.currentUser.authkey;
        		}catch(e){/*$rootScope.globals.currentUser has not been created yet*/}
        	};
        	$scope.rootScope.$watch('globals.currentUser', function(){
        		if(getAuthKey()){
        			$element.addClass('ng-show');
        			$element.removeClass('ng-hide');
        		}else{
        			$element.addClass('ng-hide');
        			$element.removeClass('ng-show');
        		}
        	});
        },

        controller : ['$scope', '$rootScope',function($scope, $rootScope){
        	$scope.rootScope = $rootScope;
        }]

	});//end of return
});
