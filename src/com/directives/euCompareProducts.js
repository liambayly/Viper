
'use strict';

europaApp.directive('euCompareProducts',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euCompareProducts.html',
		controller : ['$scope','$rootScope', function($scope, $rootScope){


            $scope.activateCompareButton = function(){
              var tmpRet = false;
              var tmpInd = 0;
                if($rootScope.comparedProducts[0].set === true){
                    tmpInd = tmpInd + 1;
                }
                if($rootScope.comparedProducts[1].set === true){
                    tmpInd = tmpInd + 1;
                }
                if($rootScope.comparedProducts[2].set === true){
                    tmpInd = tmpInd + 1;
                }

                if(tmpInd > 1){
                    tmpRet = true;
                }

                return tmpRet;
            };
            
		}]
	});
}]);