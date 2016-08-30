/* jshint ignore:start */
europaApp.directive("euAnchor",['$location', '$anchorScroll',function anchorDirective( $location, $anchorScroll ) {
                // Return the directive configuration object.
                return({
                    link: link,
                    restrict: "A",
                });
                // I bind the JavaScript events to the view-model.
                function link( scope, element, attributes ) {
                    var id = attributes.euAnchor || "";
                    element.bind('click', function (){
                        $location.hash(id);
                        $anchorScroll();
                        scope.$apply();
                    });
                }
}]);
/* jshint ignore:end */
