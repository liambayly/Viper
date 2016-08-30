//This is a simple directive example that showcases how to create a basic directive. 
//This is a mouseover directive 
'use strict';

europaApp.directive('showsMessageWhenHovered', function() {// jshint ignore:line
  return function(scope, element, attributes) {
    var originalMessage = scope.message;
    element.bind('mouseenter', function() {
      scope.message = attributes.message;
      scope.$apply();
    });
    element.bind('mouseleave', function() {
      scope.message = originalMessage;
      scope.$apply();
    });
  };
});

