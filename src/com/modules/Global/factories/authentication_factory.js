//This is the Authentication Service, this service returns the login information for the user 
'use strict';

angular.module('myApp.module.Global.Authentication.Factory', [])// jshint ignore:line


.factory('AuthenticationService',// jshint ignore:line
    ['Base64', '$http', '$cookieStore', '$cookies', '$rootScope',
    function (Base64, $http, $cookieStore, $cookies, $rootScope) {
        var service = {};

        service.Login = function (username, password, remme, callback) {


            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/Mercury/login/authenticate/', { username: username, password: password })
            //    .success(function (response) {
             //       $rootScope.loginErrorFlag = false;
             //       $rootScope.loginError = '';
             //      callback(response);
             //   }).error(function(){
              //      $rootScope.loginErrorFlag = true;
              //      $rootScope.loginError = 'There was a problem communicating with the server';
              //  });

            
            /*Local Auth Test
            --------------------------------------------------------*/
            
            $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/User/getUser.json'
                     }).success(function(data){
                        $rootScope.loginErrorFlag = false;
                        $rootScope.loginError = '';
                        callback(data);
                    }).error(function(){
                       $rootScope.loginErrorFlag = true;
                        $rootScope.loginError = 'There was a problem communicating with the server';
                    });
            
            
        };
		
		
		service.LoginWithToken = function (token, callback) {


            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/Mercury/login/authenticate2/', { authKey: token })
            //    .success(function (response) {
             //       $rootScope.loginErrorFlag = false;
             //       $rootScope.loginError = '';
             //      callback(response);
              //  }).error(function(){
              //      $rootScope.loginErrorFlag = true;
              //      $rootScope.loginError = 'There was a problem communicating with the server';
              //  });
            
            
            /* local authentication test 
            --------------------------------------------------------*/
            
            $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/User/getUser.json'
                     }).success(function(data){
                        $rootScope.loginErrorFlag = false;
                        $rootScope.loginError = '';
                        callback(data);
                    }).error(function(){
                       $rootScope.loginErrorFlag = true;
                        $rootScope.loginError = 'There was a problem communicating with the server';
                    });

        };
        
        
        //This is the set credentials function this function sets the credentials (after encrypting them) 
        //to a global function that then gets set to a cookie to allow people to come back to the site and
        //log back in. 
        service.SetCredentials = function (user, remme) {
            var authdata = Base64.encode(user.username + ':' + user.firstname+ ':' + user.lastname);
 
            $rootScope.globals = {
                currentUser: {
                    username: user.username,
                    authdata: authdata,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    authkey: user.authkey,
                    franchiseid: user.franchiseid,
                    groupperm: user.groupperm,
                    useraccountid: user.useraccountid,
                    superuser: user.superuser,
                    salesrepid: user.salesrepid,
                    retmessage: user.retmessage,
                    rememberme: remme
                }
            };
			
			$rootScope.sso = user.authkey;
 
            $http.defaults.headers.common['Authorization'] = 'Verification ' + authdata; // jshint ignore:line
            
            //This is the remember me cookie
            $cookies.put('rememberme', remme);
            
            if(remme){
                $cookies.put('sso', $rootScope.globals.currentUser.authkey, ['domain','europa-sports.net']);
				$cookieStore.put('globals', $rootScope.globals);
            }else{
                $cookies.put('sso', $rootScope.globals.currentUser.authkey, ['domain','europa-sports.net']);
            }
        };
 
        
        //This function clears the credentials and removes the cookie to ensure that the person 
        //is logged back out. 
        service.ClearCredentials = function () {
            $rootScope.globals = undefined;
			$rootScope.sso = undefined;
            $cookies.remove('globals');
            $cookies.remove('sso');
			$cookieStore.remove('sso');
			$cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Verification ';
            //Reset the global variables
            $rootScope.authkey = 0;
            $rootScope.salesRepId = 0;
            $rootScope.loginErrorFlag = false;
            $rootScope.loginError = '';
            $rootScope.userEmail = '';
        };
 
        return service;
    }])
 

//This function encrypts a string simulating the BAse64 Encryption of Java
.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    //cmment
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});