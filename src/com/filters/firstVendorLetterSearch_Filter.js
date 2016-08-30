'use strict';
/* jshint ignore:start */
europaApp.filter('firstVendorLetterSearch', function() {
   return function(items, word) {
    var filtered = [];

    angular.forEach(items, function(item) {

        var vendornameLowCase = item.vendorname || "";
        var wordLowCase = word || "";
        vendornameLowCase = vendornameLowCase.toLowerCase();
        wordLowCase = wordLowCase.toLowerCase();

        if(vendornameLowCase.indexOf(wordLowCase) !== -1){
            filtered.push(item);
        }
    });

    filtered.sort(function(a,b){

        var vendornameLowCaseA = a.vendorname || "";
        var vendornameLowCaseB = b.vendorname || "";
        var wordLowCase = word || "";
        vendornameLowCaseA = vendornameLowCaseA.toLowerCase();
        vendornameLowCaseB = vendornameLowCaseB.toLowerCase();
        wordLowCase = wordLowCase.toLowerCase();

        if(vendornameLowCaseA.indexOf(wordLowCase) < vendornameLowCaseB.indexOf(wordLowCase)) return -1;
        else if(vendornameLowCaseA.indexOf(wordLowCase) > vendornameLowCaseB.indexOf(wordLowCase)) return 1;
        else return 0;
    });

    return filtered;
  };
});
/* jshint ignore:end */