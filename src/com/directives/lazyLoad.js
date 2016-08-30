/* jshint ignore:start */
'use strict';

europaApp.directive("loadMoreData", [function() {
        return {
            restrict: 'ACE',
            link: function($scope, element, attrs, ctrl) {
                var raw = element[0];
                element.scroll(function() {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight){
                        $scope.$apply("loadMoreData()");
                    }
                });
            }
        };
 
}])
/* jshint ignore:end */