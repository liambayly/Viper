
'use strict';

europaApp.directive('euRouteReload',['$route','$location', function($route, $location){// jshint ignore:line
	function link( scope, element ) {
        element.bind('click', function (){
        	if(this.getAttribute('eu-route-reload')){
        		$location.path(this.getAttribute('eu-route-reload'));
        	}
            $route.reload();
        });
    }
	return ({
		restrict: 'A',
		scope: {},
		replace : true,
		link : link
	});
}]);