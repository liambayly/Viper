
/*

USEAGE : 
<eu-preloader data="{{!!(API_DATA.length)}}">
	...html rendered when the data is received...
</eu-preloader>

This will show a loader gif while the "data" attr is false once it turns true then it will load the contents of within the eu-preloader tag.

*/

'use strict';

europaApp.directive('euPreloader', [function() {// jshint ignore:line
    return ({
        restrict: 'E',
        transclude: true,
        replace : true,
        scope : {
        	data : '@'
        },
        templateUrl: '/com/directives/views/euPreloader.html',
        controller : ['$scope', '$timeout', function($scope, $timeout){ // jshint ignore:line
        	//This is left here for debugging
            $scope.$watch('data', function(){
                $scope.showloader = false;
                $timeout(function(){
                    $scope.showloader = true;
                },1000);
            });
            
        }]
    });
}]);