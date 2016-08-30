'use strict';

//This is the only item you need to edit within the app.js this will change it application wide 
//This will also allow you to use 'app' to tie it to the application and it will inherit everything from the application core
var appName = 'Viper';

//Define the Application in one spot and have an alias that doesn't call all the requirements 
var globalApp = angular.module(appName,[// jshint ignore:line
                                        //'vsGoogleAutocomplete',
                                        'ngAnimate',
                                        'ngCookies',
                                        'ngNotify',
                                        'ngRoute',
                                        'angularCharts',
                                        'mwl.calendar', 
                                        'ui.bootstrap',
                                        'myApp.module.Company.Home.Controller',
                                        'myApp.module.Main.Home.Controller',
                                        'myApp.module.Profile.Main.Controller',
                                        'myApp.module.Wiki.Main.Controller',
                                        'myApp.module.Messaging.Main.Controller',
                                        'myApp.module.Administration.Main.Controller',
                                        'myApp.module.Support.Main.Controller',
                                        'myApp.module.Reporting.Main.Controller',

                                        'myApp.module.Global.Profile.Factory',
                                        'myApp.module.Global.400.Controller',
                                        'myApp.module.Global.401.Controller',
                                        'myApp.module.Global.403.Controller',
                                        'myApp.module.Global.404.Controller',
                                        'myApp.module.Global.500.Controller',
                                        'myApp.module.Global.Authentication.Controller',
                                        'myApp.module.Global.Authentication.Factory',
                                        'myApp.module.Global.Error.Controller',
                                        'myApp.module.Global.Header.Controller',
                                        'myApp.module.Global.Logout.Controller',
                                        'myApp.module.Global.sessionInjector.Factory'

                                       ]);


//Europaapp is used by items that don't require modules loaded, mostly directives that allow it to be part of the application without the need to log the dependencies needed by the application
//overall
var europaApp = angular.module(appName);// jshint ignore:line


//This is the run command within angular and it houses items that are needed to on running the application
//This is the second function to run after .config in the application instantiation
globalApp.run(['$rootScope','$location','$cookieStore', '$cookies', '$http', '$timeout', 'MessageFactory','ngNotify','ProfileFactory','AuthenticationService', 
    function ($rootScope, $location, $cookieStore, $cookies, $http, $timeout, MessageFactory, ngNotify, ProfileFactory,AuthenticationService) {
        
        
        //Setting Global Variables
        $rootScope.authkey = '0';
        $rootScope.loginErrorFlag = false;
        $rootScope.loginError = '';
        $rootScope.userEmail = '';
        $rootScope.preLoader = false;
        $rootScope.errorMessageFlag = false;
        $rootScope.maintenanceMessageFlag = false;
        $rootScope.systemMessageFlag = false;
        $rootScope.recentlyViewed = [];
        $rootScope.comparedProducts = [{id: 0,pic:'', name: '', set: false},{id: 0,pic:'', name: '', set: false},{id: 0,pic:'', name: '', set: false}];
        $rootScope.compareIsFull = false;
        //$rootScope.itemsinCart = 0;
        //$rootScope.totalCart = 0;
        //$rootScope.Cart = [];
        $rootScope.mainNavActive = {};
        // keep user logged in after page refresh
        //This sets the user credentials to the cookieStore allowing the user to stay logged in even after they close the browse
        $rootScope.globals = $cookieStore.get('globals') || {};
        $rootScope.rememberMe = $cookies.get('rememberme') || {};
        $rootScope.sso = $cookies.get('sso') || {};
		



        //-----------------FUNCTIONS-----------------
        //-------------------------------------------

        //Add items to the breadcrumb trail, this allows us the ability to append the breadcrumb system link
        $rootScope.appendBreadCrumb = function(view, title){
            $rootScope.breadCrumb = $rootScope.breadCrumb.concat([{view: view,title: title}]);
            return $rootScope.breadcrumb;
        };

		$rootScope.loginWToken = function(authKey){
            AuthenticationService.LoginWithToken(authKey, function(response) {
                
                var user = response.data[0];
                
                if(user.isauth) {
                    $rootScope.authkey = user.authkey;
                    $rootScope.salesRepId = user.salesrepid;
                    $rootScope.userEmail = user.email;
                    AuthenticationService.SetCredentials(user, $rootScope.rememberMe);

                }else {
                    $rootScope.loginErrorFlag = true;
                    $rootScope.loginError = user.retmessage;
                }
                
            });
            
		};
        
        
        //This is the range function , this is global since it can be used to run an ng-repeat or other item 
        //Using this to allow us to do ng-repeat on a numeric step index. 
        $rootScope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);// jshint ignore:line
            return input;
          };
        
        $rootScope.checkErrorMessage = function(){
            MessageFactory.getErrorMessage(function(dataResponse) {
            $rootScope.errorMessage = dataResponse.data[0];
                if($rootScope.errorMessageFlag === false){
                    if($rootScope.errorMessage.success === 1){
                        $rootScope.errorMessageFlag = true;
                        ngNotify.addType('europaError', 'message__error');
                        ngNotify.set($rootScope.errorMessage.message, {type: 'europaError', position: 'top', html: true, sticky: true, duration: 4000});   
                    }
                }
            });
        };
        
        $rootScope.checkMaintenanceMessage = function(){
            MessageFactory.getMaintenanceMessage(function(dataResponse) {
            $rootScope.MaintenanceMessage = dataResponse.data[0];
                if($rootScope.maintenanceMessageFlag === false){
                    if($rootScope.MaintenanceMessage.success === 1){
                        $rootScope.maintenanceMessageFlag = true;
                        ngNotify.addType('europaMaintance', 'message__maintenance');
                        ngNotify.set($rootScope.MaintenanceMessage.message, {type: 'europaMaintance', position: 'top', html: true, sticky: true, duration: 4000});   
                    }
                }
            });
        };
        
        $rootScope.checkSystemMessage = function(){
            MessageFactory.getSystemMessage(function(dataResponse) {
            $rootScope.SystemMessage = dataResponse.data[0];
                if($rootScope.systemMessageFlag === false){
                    if($rootScope.SystemMessage.success === 1){
                        $rootScope.systemMessageFlag = true;
                        ngNotify.addType('europaSystem', 'message__system');
                        ngNotify.set($rootScope.SystemMessage.message, {type: 'europaSystem', position: 'top', html: true, sticky: true, duration: 4000});   
                    }
                }
            });
        };
		
		
        //-----------------INIT PROCESSING-----------------
        //-------------------------------------------------

        //IE 11 has not console object unless you open the dev tools this is so when you open the website without dev tools we can call the console.log function without 
        // Avoid `console` errors in browsers that lack a console.
        (function() {
            var methods = [
                'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
                'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
                'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                'timeStamp', 'trace', 'warn'
            ];
            window.console = window.console || {};
            for( var index = 0; index < methods.length; index++){
                // Only stub undefined methods.
                if (!window.console[ methods[index] ]) {
                    window.console[ methods[index] ] = function () {};
                }
            }
        }());

        //check auth info
        if ($rootScope.sso.length) {
            $rootScope.loginWToken($cookies.get('sso'));
            $http.defaults.headers.common['Authorization'] = 'Verification ' + ' Anonymous'; // jshint ignore:line
            globalApp.value('user', {
                authKey: $rootScope.sso
            });
        }

        //This is the call to set the profile information 
        ProfileFactory.getProfile(function(dataResponse) {
            $rootScope.serverProfile = dataResponse.data[0];
        });
                
        $timeout(function killPreLoader() {
            $rootScope.preLoader = true;
            //There is an issue with the screen flashing on the init load.
            //It flashes as the ng-if and ng-show will not happen until angular and all the modules load. So to hide this we can't use angular.
            //We attached a hide class to the main content to hide the content when th app loads we remove the class so the ng-show will be able to do it's thing
            $('#indexHTMLContent').removeClass('hide');// jshint ignore:line
            $( "#indexHTMLContent" ).fadeIn( 700, function() {// jshint ignore:line
              // Animation complete
            });
            //$( "#indexHTMLLoader" ).fadeOut( "slow", function() {});// jshint ignore:line
        }, 2000);
        
        //End of the compare functions that run the compare object
 
        //Once all of the dependencies are resolved $routeChangeSuccess is fired.
        //This has a few functions that the application uses including setting the active for the menu and the dynamic title
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){// jshint ignore:line
                //Change page title, based on Route information
                $rootScope.pageTitle = current.$$route.title;
                $rootScope.menuGroup = current.$$route.menuGroup;
                $rootScope.protected = current.$$route.protectedArea;
                $rootScope.metaDescription = current.$$route.description;
                $rootScope.keywords = current.$$route.metaKeywords;
                $rootScope.breadCrumb = current.$$route.breadcrumbList;

                $rootScope.checkErrorMessage();
                $rootScope.checkMaintenanceMessage();
                $rootScope.checkSystemMessage();

                //Redirects the user from protected areas if they are not logged in.
                if(current.$$route.protectedArea && !$rootScope.globals.currentUser){
                    $location.path('/');
                }
                
                /*
                    This handles the mainNavbar highlighting
                    The controller should have either menuGroup='Store' 
                    or an chain in an array menuGroup=['company', 'companyEvents']
                    the string will only highlight the main navbar section but if you want
                    to highlight a deeper set use the array method these names should match
                    with the ng-class assigned to the element in question
                */
                $rootScope.mainNavActive = {};
                if(typeof current.$$route.menuGroup === 'object'){
                    for (var index = 0; index < current.$$route.menuGroup.length; index++) {
                        $rootScope.mainNavActive[current.$$route.menuGroup[index]] = 'mainNav--active';
                    }
                }else if(typeof current.$$route.menuGroup === 'string'){
                    $rootScope.mainNavActive[current.$$route.menuGroup] = 'mainNav--active';
                }

                $rootScope.isActive = function (viewLocation) { 
                    return viewLocation === current.$$route.menuGroup;
                };
        });
        
        
    }]);


//This is the default route all routes are located within the modules thus making them stand alone objects so to speak 
//setting this will change the default location that the spa points to . 
europaApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider',  function ($routeProvider, $locationProvider, $httpProvider, $compileProvider) {// jshint ignore:line

    $httpProvider.interceptors.push('sessionInjector');
    
    $routeProvider.otherwise({ redirectTo: '/' });
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    //http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';// jshint ignore:line



    $compileProvider.debugInfoEnabled(true); //change this to false for production
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode({
        enabled : true,
        requireBase: false
    });
        
    //This is the global interceptor that will handle the 401 error and reload the page 
    $httpProvider.interceptors.push(function ($q) {
        return {
            'response': function (response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function (rejection) {
                if(rejection.status === 401) {
                    //location.reload();
                    //location.path('/401');
                }
                if(rejection.status === 404) {
                    //location.path('/404');
                }
                if(rejection.status === 405) {
                    //Put Error Handling Here
                }
                if(rejection.status === 400) {
                    //location.path('/400');
                }
                if(rejection.status === 304) {
                    //Put Error Handling Here
                }
                if(rejection.status === 500) {
                    //location.reload();
                    //location.path('/500');
                }
                return $q.reject(rejection);
            }
        };
    });
    
    //End of the interceptor
}]);
