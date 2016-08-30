'use strict';


angular.module('myApp.module.Global.sessionInjector.Factory', [])// jshint ignore:line

.factory('sessionInjector', ['$rootScope',  function($rootScope) {  
    var sessionInjector = {
        request: function(config) {
            if($rootScope.globals.currentUser){
                 config.headers['authkey'] = $rootScope.globals.currentUser.authkey;// jshint ignore:line
            }else{
                 config.headers['authkey'] = 0;// jshint ignore:line
            }
            return config;
        }
    };
    return sessionInjector;
}]);