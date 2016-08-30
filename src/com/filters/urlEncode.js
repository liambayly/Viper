'use strict';
/* jshint ignore:start */
europaApp.filter('urlencode', function() {
  return function(input) {
    return window.encodeURIComponent(input);
  }
});
/* jshint ignore:end */