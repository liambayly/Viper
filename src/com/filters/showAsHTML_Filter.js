/* jshint ignore:start */
europaApp.filter('showAsHTML', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
/* jshint ignore:end */
