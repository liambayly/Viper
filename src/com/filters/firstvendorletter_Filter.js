'use strict';
/* jshint ignore:start */
europaApp.filter('firstVendorLetter', function() {
    return function(input, letter) {
      return (input || []).filter(function(item) {
      	if(letter === '#'){
      		//checks if the first character is not A-Z or a-z
      		return (item.vendorname.charAt(0).search(/^[a-zA-Z]*$/) === -1);
      	}else{
        	return item.vendorname.charAt(0).toUpperCase() === letter;
      	}
      });
    };
  });
/* jshint ignore:end */