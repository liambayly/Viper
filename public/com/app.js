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

/* jshint ignore:start */
europaApp.directive('aDisabled', function() {
    return {
        compile: function(tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")";

            //return a link function
            return function (scope, iElement, iAttrs) {

                //Toggle "disabled" to class when aDisabled becomes true
                scope.$watch(iAttrs["aDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function(e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});
/* jshint ignore:end */
'use strict';

//This is the directive specification pulling in the view template and restricting the use of the directive. 
europaApp.directive('breadcrumb', function() {// jshint ignore:line
  return {
    restrict: 'A',
    controller: 'breadcrumbController',
    templateUrl: '/com/directives/views/breadcrumb.html',
    scope : {breadcrumb : '@'}
  };
});

//This is the controller with functions that are specific to the pagination, because some of those functions are global they have been added into the 
//application wide scope for use in the application. if you need to debug them you can do that in the app.js but they should be working fine and not require 
//editing 
europaApp.controller('breadcrumbController',// jshint ignore:line
    ['$scope','$rootScope', function ($scope, $rootScope) {// jshint ignore:line
        $scope.breadcrumbData = $rootScope.breadCrumb;
        $scope.pageTitle = $rootScope.pageTitle;
    	if($scope.breadcrumb === undefined){
    		$scope.breadcrumb = 'content';
    	}
        
    	$scope.check = function(value){
    		return (value === $scope.breadcrumb);
    	};
        
    }]);
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

/*!
 *  Apply as a attribute of the body tag. Set
 *  breakpoint="{1250:'break1250', 1000:'break1000',1120:'break1120'}
 *
 *  Values are available on scope as
 *  {{breakpoint.class}} = current set class
 *  {{breakpoint.windowSize}} = current width of window
 */
/* jshint ignore:start */
europaApp.directive('breakpoint', ['$window', '$rootScope', function($window, $rootScope){
    return {
        restrict:"A",
        link:function(scope, element, attr){
            scope.breakpoint = {class:'', windowSize:$window.innerWidth }; // Initialise Values

            var breakpoints = (scope.$eval(attr.breakpoint));
            var firstTime = true;

            angular.element($window).bind('resize', setWindowSize);

            scope.$watch('breakpoint.windowSize', function(windowWidth, oldValue){
                setClass(windowWidth);
            });

            scope.$watch('breakpoint.class', function(newClass, oldClass) {
                if (newClass != oldClass || firstTime) {
                    broadcastEvent(oldClass);
                    firstTime = false;
                }
            });

            function broadcastEvent (oldClass) {
                $rootScope.$broadcast('breakpointChange', scope.breakpoint, oldClass);
            }

            function setWindowSize (){
                scope.breakpoint.windowSize = $window.innerWidth;
                if(!scope.$$phase) scope.$apply();
            }

            function setClass(windowWidth){
                var setClass = breakpoints[Object.keys(breakpoints)[0]];
                for (var breakpoint in breakpoints){
                    if (breakpoint < windowWidth) setClass = breakpoints[breakpoint];
                    element.removeClass(breakpoints[breakpoint]);
                }
                element.addClass(setClass);
                scope.breakpoint.class  = setClass;
                if(!scope.$$phase) scope.$apply();
            }
        }
    }
}]);
/* jshint ignore:end */

'use strict';

europaApp.directive('euCompareProducts',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euCompareProducts.html',
		controller : ['$scope','$rootScope', function($scope, $rootScope){


            $scope.activateCompareButton = function(){
              var tmpRet = false;
              var tmpInd = 0;
                if($rootScope.comparedProducts[0].set === true){
                    tmpInd = tmpInd + 1;
                }
                if($rootScope.comparedProducts[1].set === true){
                    tmpInd = tmpInd + 1;
                }
                if($rootScope.comparedProducts[2].set === true){
                    tmpInd = tmpInd + 1;
                }

                if(tmpInd > 1){
                    tmpRet = true;
                }

                return tmpRet;
            };
            
		}]
	});
}]);

'use strict';

europaApp.directive('euEventsListings',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euEventsListings.html',
		controller : ['$scope','EventFactory', function($scope, EventFactory){
	        EventFactory.getFPEvents(function(dataResponse) {
	            $scope.FpEvents = dataResponse.data;
	        });
		}]
	});
}]);
/*
This is the euIf directive

**NOTE**
This is so the design team can create custom requests and be consistent without having to worry about the where the variables are located 
also If the application changes the location the design team does not have to be concerned with the change.

HTML USAGE:
    <h1 class="pageTitle" eu-if='signedOut' > Please Log in</h1>
    <h1 class="pageTitle" eu-if='signedIn' > You are Logged in</h1>

ADDING CONTENT:
    Just add an entry into the varList and everything else is done for you.
*/

'use strict';

europaApp.directive('euIf', [function() {// jshint ignore:line
    return ({
        restrict: 'A',
        transclude: true,
        scope : {},
        controller: ['$scope','$rootScope', function($scope, $rootScope) { // jshint ignore:line
            

            //This is the List of values we are looking for
            var varList = {

                //attribute value : [ the value we are watching , what it should be equal to ]
                'signedIn' : ['$rootScope.globals.currentUser.authkey', true],
                'signedOut' : ['$rootScope.globals.currentUser', false]

            };



            //This will watch a value in a scope if it is not being watched
            var watch = function(scope, value, callback){
                watch.list = watch.list || {};
                callback = callback || $scope.transclude;
                if(watch.list[value] === undefined){
                    watch.list[value] = value;
                    scope.$watch(value, callback);
                }
            };
            //checks if the value is true
            $scope.check = function(){
                var checkResults = false;
                var euIf = $scope.euIf;
                //Is the euIf value in the list?
                if(varList[euIf]){
                    //converting the List data into something the watch function understands
                    var scopeFromList = eval(varList[euIf][0].split('.')[0]);// jshint ignore:line
                    var valueFromList = varList[euIf][0].split('.');
                    valueFromList.shift();
                    //watch for changes
                    watch(scopeFromList, valueFromList.join('.'));
                    //try and evaluate if the value is equal. We do the try as undefined.foo() will throw an error
                    try{
                        //!! converts all values to a bool
                        if(!!(eval(varList[euIf][0])) === varList[euIf][1]){// jshint ignore:line
                            checkResults = true;
                        }
                    }catch(e){
                        console.log(e);
                    }
                }
                //retrun the check results
                return checkResults;
            };
            
        }],
        link: function($scope, $element, $attrs, ctrl, $transclude){

            
            //passes the euIf attribute to the $scope so we can use it in the controller
            $scope.euIf = $attrs.euIf;
            //holding on to these so we can clear the content and scope if/when we need to
            var transcludedContent, transclusionScope;
            //transclude function we wrap it in a function so we can call it on a watch
            $scope.transclude = function(){
                //custom transclue
                $transclude(function(clone, scope) {
                    if($scope.check()){
                        //adding content and holding the clone and scope so we can remove later
                        $element.html(clone);
                        transcludedContent = clone;
                        transclusionScope = scope;

                    }
                    //we check if transcludedContent is there so we don't get error for trying undefined.remove()
                    else if (transcludedContent){
                        //removing content
                        transcludedContent.remove();
                        transclusionScope.$destroy();
                    }
                });
            };
            //start of the transclude function
            $scope.transclude();
        },
    });
}]);


'use strict';

europaApp.directive('euJustGrungeLine',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euJustGrungeLine.html',
		controller : ['$scope','AdFactory', function($scope, AdFactory){
	        AdFactory.getVerticals(function(dataResponse) {
	            $scope.verticalBanners = dataResponse.data;

	            //setting url links to the banner objects
	            for (var index = 0; index < $scope.verticalBanners.length; index++) {
	            	/*
	            	*I used bannerid so we can change the name of the banner and not break anything
	            	*I placed the name of what it should be on the top of each if statement
	            	*It is requested that some of the links open new tabs so we need to include
	            	href target values as well. The links that are internal keep the urlTarget blank
	            	if we fill it with anything the single page app will refresh and load the full 
	            	app again.
					*/

	            	//'Where's Europaman' - 1534
	            	if($scope.verticalBanners[index].bannerid === 1534){
	            		$scope.verticalBanners[index].urlLink = 'https://www.europasports.com/europaman/index.cfm';
	            		$scope.verticalBanners[index].urlTarget='_blank';
	            	}

	            	//'Browse Gluten Free' - 1535
	            	else if($scope.verticalBanners[index].bannerid === 1535){
	            		$scope.verticalBanners[index].urlLink = '/productlist?glutenfree=1';
	            		$scope.verticalBanners[index].urlTarget='';
	            	}

	            	//'ISSN' - 1536
	            	else if($scope.verticalBanners[index].bannerid === 1536){
	            		$scope.verticalBanners[index].urlLink = 'http://www.sportsnutritionsociety.org/';
	            		$scope.verticalBanners[index].urlTarget='_blank';
	            	}

	            	//'Europa University' - 1537
	            	else if($scope.verticalBanners[index].bannerid === 1537){
	            		$scope.verticalBanners[index].urlLink = 'http://www.europauniversity.com/';
	            		$scope.verticalBanners[index].urlTarget='_blank';
	            	}

	            	//'Kool Stuff We Don't Sell' - 1538
	            	else if($scope.verticalBanners[index].bannerid === 1538){
	            		$scope.verticalBanners[index].urlLink = '/koolstuff';
	            		$scope.verticalBanners[index].urlTarget='';
	            	}
	            	else{
						$scope.verticalBanners[index].urlLink = '#';
						$scope.verticalBanners[index].urlTarget='_self';
	            	}

	            }
	        });
		}]
	});
}]);

'use strict';


/*

This directive just augmenting a url given to it to include the following
pageSize (Number), sortType (Number), pageNumber (Number)

This directive does use the config results approch

---parent controller---
$scope.bar = {
			config : {
				url : {}
			},
			result : {
				url : {}
			}
        };
---parent html----

<eu-paginate link="directive.euPaginate">
	...html that is within the two bars...
</eu-paginate>
*/

europaApp.directive('euPaginate', function() {// jshint ignore:line
	return {
		restrict: 'E',
		controller: 'euPaginationController',
		templateUrl: '/com/directives/views/euPaginate.html',
		transclude : true,
		scope : {
			link : '='
		}
	};
})
.controller('euPaginationController', ['$scope','$rootScope', '$routeParams', 'StoreFactory', '$location', function ($scope, $rootScope, $routeParams,StoreFactory, $location) { // jshint ignore:line

	//getting default or previous values

	//decalring and setting to previous if possible 
	$scope.sortConfig = {
		page : new Number($routeParams.pageNumber)+0 , //jshint ignore:line
		sort : $routeParams.sortOrder,
		show : $routeParams.pageSize,
	};
	//setting defaults
	if(!$scope.sortConfig.page){
		$scope.sortConfig.page = 1;
		$location.search('pageNumber', 1);
	}
	if(!$scope.sortConfig.sort){
		$scope.sortConfig.sort = 0;
		$location.search('sortOrder', 0);
	}
	if(!$scope.sortConfig.show){
		$scope.sortConfig.show = 20;
		$location.search('pageSize', 20);
	}

	//As it was easier for the server to have the sort as an index number We created this array which the index number matches to
	//DO NOT CHANGE THE ORDER OF THE SORTLIB ARRAY AS IT MATCHES THE LIST ON THE SERVICE LAYER
	$scope.sortLib = ['A to Z', 'Z to A', 'Newest', 'Price Low to High', 'Price High to Low'];
	$scope.sortList = [];
	$scope.textFieldForPageNumber = $scope.sortConfig.page;

	for (var i = 0; i < $scope.link.config.sort.length; i++) {
		$scope.sortList.push($scope.sortLib[$scope.link.config.sort[i]]);
	}

	$scope.setSort = function(index){
		$scope.sortConfig.sort = index;
		$location.search('sortOrder', index);
	};

	$scope.setShow = function(value){
		$scope.sortConfig.show = value;
		$location.search('pageSize', value);
		$scope.setPage($scope.sortConfig.page);
	};

	$scope.setPage = function(index){
		var possibleRange = $scope.getItemRange(index);
		var newIndex = setPageLimits(index, possibleRange[0], possibleRange[1]);
		$scope.sortConfig.page = newIndex;
		$location.search('pageNumber', newIndex);
		$scope.textFieldForPageNumber = newIndex;
	};
	$scope.link.setPage = $scope.setPage;

	var setPageLimits = function(index, min){// jshint ignore:line
		if(min <= 1){
			index = 1;
		}else if (min > $scope.link.config.numberOfProducts){
			index--;
			var newMinMax = $scope.getItemRange(index);
			index = setPageLimits(index, newMinMax[0], newMinMax[1]);
		}
		return index;
	};

	$scope.getItemRange = function(index){
		index = index || $scope.sortConfig.page;
		var min = index * $scope.sortConfig.show - $scope.sortConfig.show + 1;
		var max = index * $scope.sortConfig.show;
		if (max > $scope.link.config.numberOfProducts){
			max = $scope.link.config.numberOfProducts;
		}
		return [min, max];
	};
	$scope.getItemRangeText = function(){
		var array = $scope.getItemRange();
		return array[0] + '-' + array[1];
	};

	$scope.getMaxPageCount = function(){
		return Math.ceil($scope.link.config.numberOfProducts / $scope.sortConfig.show);
	};
	$scope.$watchCollection('sortConfig', function sortConfigWatcher(){
        $scope.link.result.url = StoreFactory.getProductListUrlBySortConfiguration($scope.sortConfig);
    });

}]);//jshint ignore:line







/*

USEAGE : 
<eu-preloader data="{{!!(API_DATA.length)}}">
	...html rendered when the data is received...
</eu-preloader>

This will show a loader gif while the "data" attr is false once it turns true then it will load the contents of within the eu-preloader tag.

*/

'use strict';

europaApp.directive('euPreloader', [function() {// jshint ignore:line
    return ({
        restrict: 'E',
        transclude: true,
        replace : true,
        scope : {
        	data : '@'
        },
        templateUrl: '/com/directives/views/euPreloader.html',
        controller : ['$scope', '$timeout', function($scope, $timeout){ // jshint ignore:line
        	//This is left here for debugging
            $scope.$watch('data', function(){
                $scope.showloader = false;
                $timeout(function(){
                    $scope.showloader = true;
                },1000);
            });
            
        }]
    });
}]);

//Directive to apply currency filter to prices if the user is logged in
/*
USAGE :

Assuming the following:
	product.price = 12.43;
	$scope.authFailedMsg = 'N/A';


HTML:
	<p eu-price="{{product.price}}"></p>

should product : 
	if auth passes:
		<p eu-price="12.43">12.43</p>
	if auth fails:
		<p eu-price="12.43">N/A</p>
*/


'use strict';

europaApp.directive('euPrice', function() {// jshint ignore:line
	return ({
	    restrict: 'A',
	    //get data from the attribute
	    scope: {
	    	//one way data binding with the attr price and sets the variable to the scope
	    	euPrice : '@',
	    	euMessage : '@'
	    },
        controller: ['$scope', '$filter', '$attrs','$rootScope', function($scope, $filter, $attrs, $rootScope) {
        	
        	//holds the price so it can be called as we will overwrite it.
        	$scope.price = $scope.euPrice;
        	//setting a auth failed message
        	$scope.euMessage = $scope.euMessage || '';

        	var changePrice = function(){
	        	//If the auth is good set the currency filter to the price. If it fails then set it to the fail message.
	        	if($rootScope.globals.currentUser !== undefined && $rootScope.globals.currentUser.authkey){
	        		//if authentication is good overwrite it with the held $scope.price value
	        		$attrs.$set('euPrice', $filter('currency')($scope.price));
	        	}else{
	        		$attrs.$set('euPrice', $scope.euMessage);
	        	}
        	};
        	//first call
        	changePrice();
        	//watch if the auth changes
        	$rootScope.$watch('globals.currentUser', changePrice);
        	
	    }],
	    templateUrl: '/com/directives/views/euPrice.html'
	});
});

 /*jshint ignore:start */

europaApp.directive("euProductFilter",function euProductFilterDirective( ) {
                return({
                    restrict: "E",
                    templateUrl: '/com/directives/views/euProductFilter.html',
                    controller: 'euProductFilterController',
                    scope: {
                    	link : '='
                    }
                });
})

.controller('euProductFilterController',// jshint ignore:line
['$scope','$rootScope', 'StoreFactory', '$routeParams', '$location', function ($scope, $rootScope, StoreFactory, $routeParams, $location) {// jshint ignore:line

	$scope.serviceCall = $scope.link.config.serviceCall || StoreFactory.refreshProductFilters;
	$scope.acceptOnlyServiceCallWithId = 0;
	$scope.serviceCallOptions = {
		discontinued : $routeParams.discontinued || 0,
        newproducts : $routeParams.newproducts || 0,
        glutenfree : $routeParams.glutenfree || 0,
        vendor: $routeParams.vendor || $routeParams.Brand || 0,
        category: $routeParams.category || 0,
        size: $routeParams.size || 0,
        flavor: $routeParams.flavor || 0,
        price: $routeParams.price || 0,
        specials: $routeParams.specials || 0,
        product: $routeParams.product || 0,
        baseUrlParameters: $scope.link.config.baseUrlParameters
	}

	if($routeParams.type && $routeParams.type.toLowerCase() === 'category'){
		$scope.serviceCallOptions.category = $routeParams.id;
	}else if($routeParams.type === 'vendor' || $routeParams.type === 'Brand'){
		$scope.serviceCallOptions.vendor = $routeParams.id;
	}


	//These is the list of all filters available
	$scope.filters = {
		brand : {
			//text is the Text that is shown on the filter by dropdown bar
			text : 'Brand',
			//This sis the type of filter it is
			type : 'dropdown',
			//This is the active filter if no active filter it should be a falsy value
			active : $routeParams.vendorActive || '',
			//link is the value expected in the scope.link variable that the controller that calls this directive will have
			link : 'brand',
			//showOn is the controller for when the drop down for this filter is shown
			showOn : 'brand',
			//data is the list of data needed by this filter. Normally it stores the list or available filter options given by the server
			data : [],
			//the variable name from the service call shown in the downdrop list
			showValue : 'vendorname',
			//set is what happens when you set the filter
			set : function (item){
				$scope.serviceCallOptions.vendor = item.vendorid;
				$scope.filters.brand.active = item.vendorname;
				$location.search('vendor', item.vendorid);
				$location.search('vendorActive', item.vendorname);
				$scope.activateDropdown();
				makeServiceCall();
			},
			//removes the filter
			remove : function(item){
				$scope.serviceCallOptions.vendor = 0;
				$location.search('vendor', null);
				$location.search('vendorActive', null);
				$scope.filters.brand.active = '';
				makeServiceCall();
			}
		},
		category : {
			text : 'Category',
			type : 'dropdown',
			active : $routeParams.categoryActive || '',
			link : 'category',
			showOn : 'category',
			data : [],
			showValue : 'categoryname',
			set : function (item){
				$scope.serviceCallOptions.category = item.primarycategoryid;
				$scope.filters.category.active = item.categoryname;
				$scope.activateDropdown();
				$location.search('category', item.primarycategoryid);
				$location.search('categoryActive', item.categoryname);
				makeServiceCall();
			},
			remove : function(item){
				$scope.serviceCallOptions.category = 0;
				$scope.filters.category.active = '';
				$location.search('category', null);
				$location.search('categoryActive', null);
				makeServiceCall();
			}
		},
		flavor : {
			text : 'Flavor',
			type : 'dropdown',
			active : $routeParams.flavorActive || '',
			link : 'flavor',
			showOn : 'flavor',
			data : [],
			showValue : 'flavor',
			set : function (item){
				$scope.serviceCallOptions.flavor = item.flavor;
				$scope.filters.flavor.active = item.flavor;
				$scope.activateDropdown();
				$location.search('flavor', item.flavor);
				$location.search('flavorActive', item.flavor);
				makeServiceCall();
			},
			remove : function(item){
				$scope.serviceCallOptions.flavor = 0;
				$scope.filters.flavor.active = '';
				$location.search('flavor', null);
				$location.search('flavorActive', null);
				makeServiceCall();
			}
		},
		product : {
			text : 'Product',
			type : 'dropdown',
			active : $routeParams.productActive || '',
			link : 'product',
			showOn : 'product',
			data : [],
			showValue : 'productname',
			set : function (item){
				$scope.serviceCallOptions.product = item.productname;
				$scope.filters.product.active = item.productname
				$scope.activateDropdown();
				$location.search('product', item.productname);
				$location.search('productActive', item.productname);
				makeServiceCall();
			},
			remove : function(item){
				$scope.serviceCallOptions.product = 0;
				$scope.filters.product.active = '';
				$location.search('product', null);
				$location.search('productActive', null);
				makeServiceCall();
			}
		},
		specialsOnly : {
			text : 'View Only Specials',
			type : 'selector',
			checked : !!($routeParams.specialsOnly) || false,
			count : 0,
			set : function (model){
				if(model){
					$scope.serviceCallOptions.specials = 1;
					$location.search('specialsOnly', 1);
				}else{
					$scope.serviceCallOptions.specials = 0;
					$location.search('specialsOnly', null);
				}
				makeServiceCall();
			}
		}
	};
	//this converts the users filters = ['brand', 'category'] to the filter objects and places them into the activeFilters object
	$scope.activeFilters = [];
	var listOfNames = $scope.link.config.filters;
	for (var nameIndex = 0; nameIndex<listOfNames.length; nameIndex++){
		$scope.activeFilters.push($scope.filters[listOfNames[nameIndex]])
	}

	var fillFilterData = function(data){
		data = data || [];
		$scope.filters.flavor.data = data.FLAVORFILTER || 0;
		$scope.filters.category.data = data.PRIMARYCATEGORYFILTER || 0;
		$scope.filters.product.data = data.PRODUCTLINEFILTER || 0;
		$scope.filters.brand.data = data.VENDORFILTER || 0;
		$scope.filters.specialsOnly.count = data.SPECIALSCOUNT || 0;
	}


	//declare and call the service call
	//This ID is to prevent async data crossing with multiple calls happening at the same time
    var makeServiceCall = function(){
    	//set the id to a random number
    	$scope.acceptOnlyServiceCallWithId = Math.random();
    	//this should make the filters go gray until new data comes
    	for (var filter in $scope.filters) {
    		$scope.filters[filter].data = [];
    		$scope.filters[filter].count = 0;
    	};
    	//getting data from the service call
	    $scope.serviceCall(function(dataResponse,id) {
	    	//If the id for the call is what we are looking for apply the changes
	    	if($scope.acceptOnlyServiceCallWithId === id){
	    		fillFilterData(dataResponse.data);
	    		$scope.acceptOnlyServiceCallWithId = 0;
			}
	    }, $scope.serviceCallOptions, $scope.acceptOnlyServiceCallWithId);

	    //This will only get the url String and not make a service call
	    $scope.link.results = $scope.serviceCallOptions;
	}



    $scope.activateDropdown = function(item){
        if($scope.activeDropdown === item){
            $scope.activeDropdown = undefined;
        }else{
            $scope.activeDropdown = item;
        }
    };

	makeServiceCall();

}]);

/* jshint ignore:end */
 /*jshint ignore:start */

europaApp.directive("euProductSummary",function euProductSummaryDirective( ) {
                return({
                    restrict: "E",
                    templateUrl: '/com/directives/views/euProductSummary.html',
                    controller: 'euProductSummaryController',
                    scope: {
                    	data : '=',
                        spinner : '='
                    }
                });
})

.controller('euProductSummaryController', ['$scope','$rootScope','$filter','$location','$routeParams', 'FoundationApi', 'StoreFactory', 'CartFactory', 'WishlistFactory', function($scope,$rootScope,$filter,$location,$routeParams,FoundationApi,StoreFactory,CartFactory, WishlistFactory) {// jshint ignore:line
        $scope.cartItem = [
            {id:'0'},
            {qty:'0'},
            {name:'0'},
            {brand:'0'},
            {sc:'0'},
            {upc:'0'},
            {size:'0'},
            {flavor:'0'},
            {wholesalePrice:'0'},
            {unitPrice:'0'},
            {pic:'0'}
        ];
        $scope.nutrition = {};
        
        
        //Wishlist variables
        
        $scope.wishlist = [{id: 0},{name: ''},{namevalue: 'Wishlists'},{add:false},{create: false},{added: false},{button:false},{cartToWishList:false}];
        $scope.wishlist.id = 0;
        $scope.wishlist.name = '';
        $scope.wishlist.namevalue = 'Wishlists';
        $scope.wishlist.add = false;
        $scope.wishlist.create = false;
        $scope.wishlist.added = false;
        $scope.wishlist.button = false;
        $scope.wishlist.cartToWishList = false;
        $scope.wishlistItem = [];
        $scope.removeItemID = 0;
        
        //End the Wishlist Variables
        
        
        //Wishlist Functions
        
        
        WishlistFactory.list(function(dataResponse) {
            $scope.wishLists = dataResponse.data;
        });
        
        $scope.addItemToWishList = function(wishlistName, wishListID, productID, QTY){
            
            if($scope.checkSetWishList()){
                //resetting the values for the obj controlboard 
                $scope.wishlist.create = false;
                $scope.wishlist.added = true;
                //$scope.wishlist.id = 0;
                $scope.wishlist.namevalue = 'Wishlists';
                $scope.wishlist.button = true;
                //Adding item to the wishlist 
                WishlistFactory.addItem(wishlistName, wishListID, productID, QTY, function(dataResponse) {
                    $scope.cartItemAdd = dataResponse.data;
                    $rootScope.wishlistID = $scope.cartItemAdd[0].wishlistid;
                    $scope.wishlist.id = $scope.cartItemAdd[0].wishlistid;
                    //Regetting the list of wishlists incase a new one is added 
                    WishlistFactory.list(function(dataResponse) {
                        $scope.wishLists = dataResponse.data;
                    });
                });
                

            }
            
        };
        
        
        $scope.viewWishList = function(id){
          $scope.wishlist.id = id;
          $rootScope.wishlistID = id;
          $location.search( 'vendor', null );
          $location.search( 'id', null );
          $location.search( 'name', null );
          $location.search( 'type', null );
          $location.path('/wishlist');  
        };
        
        
        $scope.checkSetSelectWishList = function(){
          var tmpret = true;
            if($scope.wishlist.button === true){
                tmpret = false;
            }
            
            return tmpret;
        };
        
        $scope.setWishListID = function(id,name){
              $scope.wishlist.id = id;
              $scope.wishlist.name = name;
              $scope.wishlist.namevalue = name;
              $rootScope.wishlistID = id;
        };
        
        $scope.createNewWishList = function(){
            $scope.wishlist.create = true;
            $scope.wishlist.id = 0;
            $scope.wishlist.name = '+ Create New Wishlist';
            $scope.wishlist.namevalue = '+ Create New Wishlist';
        };
        
        $scope.changeWishListName = function(val){
            $scope.wishlist.name = val;
        };
        
        $scope.checkSetWishList = function(){
          var tmpret = true;
            if($scope.wishlist.namevalue === 'Wishlists'){
                tmpret = false;
            }
            
            if($scope.wishlist.name === 'Wishlists'){
                tmpret = false;
            }
            
            if($scope.wishlist.name === ''){
                tmpret = false;
            }
            
            if($scope.wishlist.input === undefined && $scope.wishlist.namevalue === '+ Create New Wishlist'){
                tmpret = false;
            }
            
            if($scope.wishlist.input === '' && $scope.wishlist.namevalue === '+ Create New Wishlist'){
                tmpret = false;
            }
            
            if($scope.wishlist.input === null && $scope.wishlist.namevalue === '+ Create New Wishlist'){
                tmpret = false;
            }
            
            return tmpret;
        };
        
        
        //End the Wishlist Functions
        
        
        
        
        //----------setting functions-------------

        $scope.newProductCheck = function(date){
            var date1 = new Date($scope.getCurrentDate());
            var date2 = new Date(date);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var newProduct = false;
            if(diffDays <= 30){
                newProduct = true;
            }else{
                newProduct = false;
            }
            return newProduct;
        };
        
        $scope.getCurrentDate = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd;
            } 

            if(mm<10) {
                mm='0'+mm;
            }

            today = mm+'/'+dd+'/'+yyyy;
            return today;
        };
        
        $scope.checkAddToCart = function(userAuth,inStock,qty){
            var showButton = false;
            if(userAuth && inStock && qty){
                showButton = true;
            }
            return showButton;
        };
    
        
        
        $scope.addToCart = function(product){
            $scope.clearCartItem();
            $scope.setCartItem(product);
            
                    CartFactory.addToCart($scope.cartItem.id, $scope.cartItem.qty, $scope.cartItem.wholesalePrice, $scope.cartItem.unitPrice, function(dataResponse) {
                        $rootScope.globals.shoppingCart = dataResponse.data;
                    });
    
            return $rootScope.globals.shoppingCart;
        };
        
        $scope.clearCartItem = function(){

            $scope.cartItem.id = '';
            $scope.cartItem.qty = '';
            $scope.cartItem.name = '';
            $scope.cartItem.brand = '';
            $scope.cartItem.sc = '';
            $scope.cartItem.upc = '';
            $scope.cartItem.size = '';
            $scope.cartItem.flavor = '';
            $scope.cartItem.wholesalePrice = '';
            $scope.cartItem.unitPrice = '';
            $scope.pic = '';
            return $scope.cartItem;
        };
        
        $scope.setCartItem = function(obj){
          
            $scope.cartItem.id = obj.productid;
            $scope.cartItem.qty = obj.prodqty;
            $scope.cartItem.name = obj.productname;
            $scope.cartItem.brand = obj.vendorname;
            $scope.cartItem.sc = obj.stockcode;
            $scope.cartItem.upc = obj.upc;
            $scope.cartItem.size = obj.size;
            $scope.cartItem.flavor = obj.flavor;
            $scope.cartItem.wholesalePrice = obj.wholesaleprice;
            $scope.cartItem.unitPrice = obj.advancedpricing;
            $scope.cartItem.pic = obj.picfile;
            return $scope.cartItem;
        };
        //These are the Nutrition Functions for the listing page.********************************************************
        $scope.getNutrition = function (id){
            //The got Data is for the preloader
            $scope.nutrition = { gotData : false };
            StoreFactory.getProductDetails(id, function(dataResponse) {
                $scope.nutrition.gotData = true;
                $scope.nutrition.productDetails = dataResponse.data.PRODUCT[0];
                $scope.nutrition.nutrients = dataResponse.data.NUTRIENT;
                $scope.nutrition.proprietaryBlends = dataResponse.data.PROPRIETARYBLENDS[0];
                $scope.nutrition.flavorsList = dataResponse.data.FLAVORS;
                $scope.nutrition.sizeList = dataResponse.data.SIZES;
            });
        };
        
        
        
        
        
        //These are the wishlist functions
        
        
        $scope.addObjToWishList =  function(obj){
          $scope.wishListItem = obj;
        };
        
        //End the wishlist functions
        


        
        //These are the Compare Functions for the listing page.******************************************************** 
        
        $scope.changeCompareItems = function(obj){
            if(obj.compare === true){
                $rootScope.addItemToCompare(obj);
            }
            
            if(obj.compare === false){
                $rootScope.removeItemFromCompare(obj.productid);
            }
        };
        
        $scope.checkCheckCompareBoxes = function(id){
          var tmpRet = false;
            if($rootScope.comparedProducts[0].id === id){
                tmpRet = true;
            }
            if($rootScope.comparedProducts[1].id === id){
                tmpRet = true;
            }
            if($rootScope.comparedProducts[2].id === id){
                tmpRet = true;
            }
            return tmpRet;
        };

}]);

 /*jshint ignore:end */


'use strict';

europaApp.directive('euRecentlyViewed',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euRecentlyViewed.html',
		controller : ['$scope','$rootScope','StoreFactory', function($scope, $rootScope, StoreFactory){
	        
            if($rootScope.authkey !== 0){
                    StoreFactory.getRecentlyViewed(function(dataResponse) {
	                   $rootScope.recentlyViewed = dataResponse.data;
                    console.log($scope.recentlyViewed);
	        });   
            }
            
		}]
	});
}]);

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

'use strict';

europaApp.directive('euSocialSection',[function(){// jshint ignore:line
    return ({
        restrict: 'E',
        scope: {},
        replace : true,
        templateUrl: '/com/directives/views/euSocialSection.html',
        controller: ['$scope','$rootScope', '$timeout', 'PublicasterFactory', function($scope, $rootScope, $timeout, PublicasterFactory){ //jshint ignore:line

            //-------SETUP VARS---------
            $scope.userSignedUp = 1;

            //-------SETUP FUNCTIONS--------
            $scope.checkEmail = function (email){
                if(email){
                    //making the call
                    PublicasterFactory.checkEmail(email, function(response){
                        $scope.userSignedUp = response.SHOWEMAILSIGNUP;
                    });
                }
            };

            $scope.signup  = function (){
                //getting the email value from the form and cleaning it up.
                var email = this.email.trim();
                //making the call
                PublicasterFactory.createUser(email, function(){
                    $scope.userSignedUp = 0;
                    $rootScope.userEmail = email;
                });
            };

            //-------SETUP WATCHERS-------------
            $rootScope.$watch('authkey',function(){
                $scope.checkEmail();
            });

            //-------INIT PROCESSING--------
            $scope.checkEmail($rootScope.userEmail);
        }]
    });
}]);

'use strict';

europaApp.directive('euWishList',[function(){// jshint ignore:line
	return ({
		restrict: 'E',
		scope: {},
		replace : true,
		templateUrl: '/com/directives/views/euWishList.html',
		controller : ['$scope','WishlistFactory', function($scope, WishlistFactory){
	        
            $scope.wishlist = [{id: 0},{name: ''},{namevalue: 'Wishlists'},{add:false},{create: false},{added: false},{button:false}];
            $scope.wishlist.id = 0;
            $scope.wishlist.name = '';
            $scope.wishlist.namevalue = 'Wishlists';
            $scope.wishlist.add = false;
            $scope.wishlist.create = false;
            $scope.wishlist.added = false;
            $scope.wishlist.button = false;
            $scope.wishlistItem = [];
            
            
            
        WishlistFactory.listWishlists(function(dataResponse) {
                $scope.wishLists = dataResponse.data;
            });
            
        
            
        $scope.continueShopping = function(){
          $scope.wishlist.create = false;
          $scope.wishlist.added = false;
          $scope.wishlist.name = '';
          $scope.wishlist.namevalue = 'Wishlists';
          $scope.wishlist.button = false;
        };
        
        
        $scope.addItemToWishList = function(){
            
            if($scope.checkSetWishList()){
                $scope.wishlist.create = false;
                $scope.wishlist.added = true;
                $scope.wishlist.id = 0;
                $scope.wishlist.name = 'Wishlists';
                $scope.wishlist.button = true;
            }
            
        };
        
        
        $scope.addCartToWishlist = function(){
            $scope.wishlist.add = true;
            $scope.wishlist.create = false;
        };
        
        
        $scope.setWishListID = function(id,name){
              $scope.wishlist.id = id;
              $scope.wishlist.name = name;
              $scope.wishlist.namevalue = name;
        };
        
        
        $scope.createNewWishList = function(){
            $scope.wishlist.create = true;
            $scope.wishlist.id = 0;
            $scope.wishlist.name = '+ Create New Wishlist';
        };
        
        
        $scope.changeWishListName = function(val){
            $scope.wishlist.name = val;
        };
        
        
        $scope.checkSetWishList = function(){
          var tmpret = true;
            if($scope.wishlist.namevalue === 'Wishlists'){
                tmpret = false;
            }
            
            if($scope.wishlist.name === 'Wishlists'){
                tmpret = false;
            }
            
            if($scope.wishlist.name === ''){
                tmpret = false;
            }
            
            return tmpret;
        };
        
        $scope.addObjToWishList = function(obj){
            $scope.wishlistItem = obj;
            console.log($scope.wishlistItem);
        };
            
            
		}]
	});
}]);
/* jshint ignore:start */
'use strict';

europaApp.directive("loadMoreData", [function() {
        return {
            restrict: 'ACE',
            link: function($scope, element, attrs, ctrl) {
                var raw = element[0];
                element.scroll(function() {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight){
                        $scope.$apply("loadMoreData()");
                    }
                });
            }
        };
 
}])
/* jshint ignore:end */
/* jshint ignore:start */
europaApp.directive("ngAnchor",function anchorDirective( $location, $anchorScroll ) {
                // Return the directive configuration object.
                return({
                    link: link,
                    restrict: "A"
                });
                // I bind the JavaScript events to the view-model.
                function link( scope, element, attributes ) {
                    // Whenever the attribute changes, we have to update our HREF state
                    // to incorporate the new ngAnchor value as the embedded fragment.
                    attributes.$observe( "ngAnchor", configureHref );
                    // Whenever the the location changes, we want to update the HREF value
                    // of this link to incorporate the current URL plus the URL-fragment
                    // that we are watching in the ngAnchor attribute.
                    scope.$on( "$locationChangeSuccess", configureHref );
                    // I update the HREF attribute to incorporate both the current top-
                    // level fragment plus our in-page URL-fragment intent.
                    function configureHref() {
                        var fragment = ( attributes.ngAnchor || "" );
                        // Strip off the leading # to make the string concatenation
                        // handle variable-state inputs (ie, ones that may or may not
                        // include the leading pound sign).
                        if ( fragment.charAt( 0 ) === "#" ) {
                            fragment = fragment.slice( 1 );
                        }
                        // Since the anchor is really the fragment INSIDE the fragment,
                        // we have to build two levels of fragment.
                        //debugger;
                        var routeValue = ($location.url().split( "#" ).shift() );
                        if(routeValue === '/'){
                            routeValue += '#';
                        }
                        var fragmentValue = ( "#" + fragment );
                        attributes.$set( "href", ( routeValue + fragmentValue ) );
                    }
                }
});
/* jshint ignore:end */


'use strict';

europaApp.directive('onAuth', function() { //jshint ignore:line
	return ({

        restrict: 'A',

        scope : {},
        
        link: function($scope, $element){ 
        	var getAuthKey = function(){
        		try{
        			return $scope.rootScope.globals.currentUser.authkey;
        		}catch(e){/*$rootScope.globals.currentUser has not been created yet*/}
        	};
        	$scope.rootScope.$watch('globals.currentUser', function(){
        		if(getAuthKey()){
        			$element.addClass('ng-show');
        			$element.removeClass('ng-hide');
        		}else{
        			$element.addClass('ng-hide');
        			$element.removeClass('ng-show');
        		}
        	});
        },

        controller : ['$scope', '$rootScope',function($scope, $rootScope){
        	$scope.rootScope = $rootScope;
        }]

	});//end of return
});

//This is the paginate directive , this directive also pulls a template to show the pagination bar 
//with a few variables this directive will control pagination on the specified page, this is an attribute
//restriction so you can use it like this <span paginate></span> and by setting currPage and pageSize (number of items per page)
//this will show and paginate through items on the page . view the events.html for a full example of it. 
'use strict';

//This is the directive specification pulling in the view template and restricting the use of the directive. 
europaApp.directive('paginate', function() {// jshint ignore:line
	return {
		restrict: 'A',
		controller: 'paginationController',
		templateUrl: '/com/directives/views/paginate.html'
	};
});


//This is the filter that filters the information on the ng-repeat to show only the items per page. 
europaApp.filter('pagination', function(){// jshint ignore:line
	return function(input, start){
		start =+ start;
		//return input.slice(start);
	};
	
});


//This is the controller with functions that are specific to the pagination, because some of those functions are global they have been added into the 
//application wide scope for use in the application. if you need to debug them you can do that in the app.js but they should be working fine and not require 
//editing 
europaApp.controller('paginationController', ['$scope','$rootScope', function ($scope,$rootScope) { // jshint ignore:line
		
		//This function will calculate the number of pages based on pageSize by dividing the data by it. 
		//This is used to tell you how many pages total are going to be displayed 
		//This function checks the total pages to see if you have gone beyond the beginning or end allowing you to disable the prev and next button

		$scope.pageNumber = 1;
		
		//This updates outside sources such as the rootScope
		$scope.$watch('pageNumber', $scope.update);
		$rootScope.$watch('pageSize', function(){
			//This will reset the page number to 1 when the user changed the amount shown on each page.
			$scope.pageNumber = 1;
			$scope.update(1, 1);
		});

		$scope.update = function(newValue){
			$scope.pageNumber = Number.parseInt($scope.pageNumber);
			if($scope.pageNumber > $scope.pagPageCount($scope.dataList,$scope.pageSize) ){
				$scope.pageNumber = $scope.pagPageCount($scope.dataList,$scope.pageSize);
			}
			if(!$scope.pageNumber || $scope.pageNumber < 1){
				$scope.pageNumber = 1;
			}
			$rootScope.pstart =  $rootScope.pageSize * (newValue - 1) + 1;
			$rootScope.pend =  $rootScope.pageSize * newValue;
			$rootScope.curPage = newValue - 1;
			return $rootScope.curPage;
		};

		$scope.numberOfPages = function(dataList,pageSize) {
			return Math.ceil(dataList.length / pageSize);
		};
		
		//This gives you the PageCount minus one to show the pages on the pagination
		$scope.pagPageCount = function(dataList,pageSize) {
			return Math.ceil(dataList.length / pageSize);
		};
		
		$scope.getCurrPage = function(){
			return $rootScope.curPage + 1;
		};
		$scope.addPageNumberBy = function(value){
			$scope.pageNumber+=value;
			return $scope.pageNumber;
		};
		

//-----------------------

		$scope.checkTotalPages = function(thisPage,dataList,pageSize) {
			var tmpTotal = Math.ceil(dataList.length / pageSize);
			var tmpReturn = false;
				if(thisPage <= tmpTotal){
					tmpReturn = true;
				}
			return tmpReturn;
		};
		
		$scope.checkBeginningPage = function(page) {
			 var tmpret = true;
			if(page <= 0){
				   tmpret = false;
			}
			return tmpret;
		};
		
		//This tells you wether you are on the current page , allowing you to activate the page number on pagination 
		$scope.isCurrentPage = function(thisPage) {
			var tmpReturn = false;
			if (thisPage === $rootScope.curPage){
				tmpReturn = true;   
			}
			return tmpReturn;
		};
		
		$scope.showPage = function(ind){
			var tmpRet = false;
			if(ind >=5){
				tmpRet = true;
			}else{
				tmpRet = false;
			}
			return tmpRet;
		};

		$scope.SetElipses = function(){
			if(!$scope.showElipses){
			   $scope.showElipses = true;
			}
		};
		
		$scope.setPaginationClass = function(tmp){
			var tmpClass = '';
		  if(tmp){
			  tmpClass = 'pagination__link pagination--current';
		  }else{
			  tmpClass = 'pagination__link'; 
		  }
			return tmpClass;
		};
		
	}]);



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


/* jshint ignore:start */
'use strict';
europaApp.directive('slick', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'AEC',
      scope: {
        initOnload: '@',
        data: '=',
        currentIndex: '=',
        accessibility: '@',
        adaptiveHeight: '@',
        arrows: '@',
        asNavFor: '@',
        appendArrows: '@',
        appendDots: '@',
        autoplay: '@',
        autoplaySpeed: '@',
        centerMode: '@',
        centerPadding: '@',
        cssEase: '@',
        customPaging: '&',
        dots: '@',
        draggable: '@',
        easing: '@',
        fade: '@',
        focusOnSelect: '@',
        infinite: '@',
        initialSlide: '@',
        lazyLoad: '@',
        onBeforeChange: '&',
        onAfterChange: '&',
        onInit: '&',
        onReInit: '&',
        onSetPosition: '&',
        pauseOnHover: '@',
        pauseOnDotsHover: '@',
        responsive: '=',
        rtl: '@',
        slide: '@',
        slidesToShow: '@',
        slidesToScroll: '@',
        speed: '@',
        swipe: '@',
        swipeToSlide: '@',
        touchMove: '@',
        touchThreshold: '@',
        useCSS: '@',
        variableWidth: '@',
        vertical: '@',
        prevArrow: '@',
        nextArrow: '@'
      },
      link: function (scope, element, attrs) {
        var destroySlick, initializeSlick, isInitialized;
        destroySlick = function () {
          return $timeout(function () {
            var slider;
            slider = $(element);
            slider.slick('unslick');
            slider.find('.slick-list').remove();
            return slider;
          });
        };
        initializeSlick = function () {
          return $timeout(function () {
            var currentIndex, customPaging, slider;
            slider = $(element);
            if (scope.currentIndex != null) {
              currentIndex = scope.currentIndex;
            }
            customPaging = function (slick, index) {
              return scope.customPaging({
                slick: slick,
                index: index
              });
            };
            slider.slick({
              accessibility: scope.accessibility !== 'false',
              adaptiveHeight: scope.adaptiveHeight === 'true',
              arrows: scope.arrows !== 'false',
              asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
              appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
              appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
              autoplay: scope.autoplay === 'true',
              autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
              centerMode: scope.centerMode === 'true',
              centerPadding: scope.centerPadding || '50px',
              cssEase: scope.cssEase || 'ease',
              customPaging: attrs.customPaging ? customPaging : void 0,
              dots: scope.dots === 'true',
              draggable: scope.draggable !== 'false',
              easing: scope.easing || 'linear',
              fade: scope.fade === 'true',
              focusOnSelect: scope.focusOnSelect === 'true',
              infinite: scope.infinite !== 'false',
              initialSlide: scope.initialSlide || 0,
              lazyLoad: scope.lazyLoad || 'ondemand',
              beforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
              onReInit: attrs.onReInit ? scope.onReInit : void 0,
              onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
              pauseOnHover: scope.pauseOnHover !== 'false',
              responsive: scope.responsive || void 0,
              rtl: scope.rtl === 'true',
              slide: scope.slide || 'div',
              slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
              slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
              speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
              swipe: scope.swipe !== 'false',
              swipeToSlide: scope.swipeToSlide === 'true',
              touchMove: scope.touchMove !== 'false',
              touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
              useCSS: scope.useCSS !== 'false',
              variableWidth: scope.variableWidth === 'true',
              vertical: scope.vertical === 'true',
              prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
              nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
            });
            slider.on('init', function (sl) {
              if (attrs.onInit) {
                scope.onInit();
              }
              if (currentIndex != null) {
                return sl.slideHandler(currentIndex);
              }
            });
            slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
              if (scope.onAfterChange) {
                scope.onAfterChange();
              }
              if (currentIndex != null) {
                return scope.$apply(function () {
                  currentIndex = currentSlide;
                  return scope.currentIndex = currentSlide;
                });
              }
            });
            return scope.$watch('currentIndex', function (newVal, oldVal) {
              if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                return slider.slick('slickGoTo', newVal);
              }
            });
          });
        };
        if (scope.initOnload) {
          isInitialized = false;
          return scope.$watch('data', function (newVal, oldVal) {
            if (newVal != null) {
              if (isInitialized) {
                destroySlick();
              }
              initializeSlick();
              return isInitialized = true;
            }
          });
        } else {
          return initializeSlick();
        }
      }
    };
  }
]);
/* jshint ignore:end */
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
/* jshint ignore:start */
europaApp.filter('showAsHTML', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
/* jshint ignore:end */

'use strict';
/* jshint ignore:start */
europaApp.filter('urlencode', function() {
  return function(input) {
    return window.encodeURIComponent(input);
  }
});
/* jshint ignore:end */
'use strict';

angular.module('myApp.module.Administration.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Administration.Main.Factory',
                                                                                                                'myApp.module.Reporting.Graph.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/administration', {
						controller: 'AdminController',
						templateUrl: 'com/modules/Administration/views/administration.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Administration Main',
						menuGroup: 'Home',
						description: 'This is The Messaging Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/administration',title:'Administration Main'}]
			});
		}])


.controller('AdminController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'AdminFactory','GraphFactory',
		function ($scope, $rootScope, $location, AdminFactory,GraphFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = AdminFactory.message;

            $scope.chartType = 'bar';
	
	$scope.config = {
    title: 'Products',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };
	
	
	$scope.config1 = {
		labels: false,
		title: 'Products',
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 110,
		outerRadius: 100
	};

	$scope.config2 = {
		labels: false,
		title: 'HTML-enabled legend',
		legend: {
			display: true,
			htmlEnabled: true,
			position: 'right'
		},
		lineLegend: 'traditional'
	};

	
  //This is the Featured Products System
			GraphFactory.getGraphBanners(function(dataResponse) {
					$scope.data = dataResponse.graph[0];
			});
	
	
			GraphFactory.getGraphBanners2(function(dataResponse) {
					$scope.data1 = dataResponse.graph[0];
			});
	
			GraphFactory.getGraphBanners3(function(dataResponse) {
					$scope.data2 = dataResponse.graph[0];
			});
            
		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Administration.Main.Factory', [])// jshint ignore:line

.factory('AdminFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Administration Factory';

            service.message = 'This is the Administration Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Company.Home.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Global.Message.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
						controller: 'HomeController',
						templateUrl: 'com/modules/Company/views/home.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Welcome',
						menuGroup: 'Home',
						description: 'This is the Description of the Home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/',title:'Home'}]
			});
		}])


.controller('HomeController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'MessageFactory',
		function ($scope, $rootScope, $location, MessageFactory) {

			$scope.message = 'This is the Home page message from the controller';

			
			//This gets the Initial Error Message
			MessageFactory.getErrorMessage(function(dataResponse) {
					$scope.globalErrorMessage = dataResponse.data;
					if(dataResponse.data.Active === 'true'){
							 $location.path('/error');
					}
					$rootScope.globalErrorMessage = dataResponse.data;
			});

			//This gets the Maintenance  Message
			MessageFactory.getMaintenanceMessage(function(dataResponse) {
					$scope.globalMaintenanceMessage = dataResponse.data;
					$rootScope.globalMaintenanceMessage = dataResponse.data;
					if(dataResponse.data.Active === 'true'){
							 $location.path('/maintenance');
					}
			});

			
			//This gets the System  Message
			MessageFactory.getSystemMessage(function(dataResponse) {
					$scope.globalSystemMessage = dataResponse.data;
			});


		}]);

'use strict';

angular.module('myApp.module.Global.400.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/400', {
            controller: '400Controller',
            templateUrl: 'com/modules/Global/views/400.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '400',
            description: 'This is the 400 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '400 Error'}]
      });
    }])


    .controller('400Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 400 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.401.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/401', {
            controller: '401Controller',
            templateUrl: 'com/modules/Global/views/401.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '401',
            description: 'This is the 401 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '401 Error'}]
      });
    }])


    .controller('401Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 401 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.403.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/403', {
            controller: '403Controller',
            templateUrl: 'com/modules/Global/views/403.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '403',
            description: 'This is the 403 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '403 Error'}]
      });
    }])


    .controller('403Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 403 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.404.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/404', {
            controller: '404Controller',
            templateUrl: 'com/modules/Global/views/404.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '404',
            description: 'This is the 404 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '404 Error'}]
      });
    }])


    .controller('404Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 404 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.500.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/500', {
            controller: '500Controller',
            templateUrl: 'com/modules/Global/views/404.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '500',
            description: 'This is the 500 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '500 Error'}]
      });
    }])


    .controller('500Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 500 error!';
    }]);
//This is the Controller for the login process this process brings the service information (Login info)
//Then it takes it and sets the credentials and clears the credentials
'use strict';


angular.module('myApp.module.Global.Authentication.Controller', ['ngRoute',// jshint ignore:line
                                                                 'myApp.module.Global.Authentication.Factory'])


.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', {
            controller: 'LoginController',
            templateUrl: 'com/modules/Global/views/login.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Login',
            menuGroup: 'Login',
            description: 'This is the Description of the Login page',
            keywords: 'Login,Authentication',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/login', title: 'Login Main'}]
      });
    }])

.controller('LoginController',// jshint ignore:line
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        //AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, $scope.rememberme, function(response) {
                
                $scope.user = response.data[0];
                
                if($scope.user.isauth) {
                    $rootScope.authkey = $scope.user.authkey;
                    $rootScope.salesRepId = $scope.user.salesrepid;
                    $rootScope.userEmail = $scope.user.email;
                    AuthenticationService.SetCredentials($scope.user, $scope.rememberme);
                    
                    $scope.username = '';
                    $scope.password = '';
                    $location.path('/main');
                    
                }else {
                    $rootScope.loginErrorFlag = true;
                    $rootScope.loginError = $scope.user.retmessage;
                    $scope.dataLoading = false;
                }
                
            });
            
            
            
            return $rootScope;
        };
        
        $scope.logout = function () {
            
            AuthenticationService.ClearCredentials();
            console.log('LOGGED OUT');
			//$location.path('/loginPage');
        };
    }]);
'use strict';

angular.module('myApp.module.Global.Error.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/error', {
            controller: 'errorController',
            templateUrl: 'com/modules/Global/views/error.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Error Screen',
            menuGroup: 'Error',
            description: 'This is the Error Screen',
            keywords: 'error,danger,thiserror',
            breadcrumbList: [{view: '/', title: 'Home'}, {view: '/error', title: 'There Has been an Error'}]
      });
    }])


    .controller('errorController', ['$scope', function($scope) {
        $scope.message = 'There has been an error!';
    }]);
//This is the home controller that simply sets a message and returns it to the view.
'use strict';

angular.module('myApp.module.Global.Header.Controller', ['ngRoute', // jshint ignore:line
                                                         ])


.controller('HeaderController',// jshint ignore:line
    ['$scope', '$rootScope','$location', 'AuthenticationService', 
    function ($scope, $rootScope) {
        
      $scope.message = 'This is the Header Message';
      $rootScope.message = 'This is hte test rootscope message';
        
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    }]);
//This is the Controller for the login process this process brings the service information (Login info)
//Then it takes it and sets the credentials and clears the credentials
'use strict';


angular.module('myApp.module.Global.Logout.Controller', ['ngRoute','myApp.module.Global.Authentication.Factory'])// jshint ignore:line


.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/logout', {
            controller: 'LogoutController',
            templateUrl: 'com/modules/Global/views/logout.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Logout',
            menuGroup: 'Login',
            description: 'This is the Description of the Logout page',
            keywords: 'Login,Authentication',
            breadcrumbList: [{view: '/',title:'Home'}]
      });
    }])

.controller('LogoutController',// jshint ignore:line
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
        //$location.path('/');
    }]);
'use strict';

angular.module('myApp.module.Global.Maintenance.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/maintenance', {
            controller: 'maintenanceController',
            templateUrl: 'com/modules/Global/views/maintenance.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Maintenance Screen',
            menuGroup: 'Home',
            description: 'This is the Maintenance Screen',
            keywords: 'error,danger,thiserror',
            breadcrumbList: [{view: '/', title: 'Home'}, {view: '/maintenance', title: 'Maintenance'}]
      });
    }])


    .controller('maintenanceController', ['$scope', function($scope) {
        $scope.message = 'The System is in Maintenance Mode!';
    }]);

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
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Message.Factory', [])// jshint ignore:line

.factory('MessageFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Message Factory';

            service.getErrorMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getError.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
        
        
            service.getMaintenanceMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getMaintenance.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getSystemMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getSystem.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
         return service;
    }]);
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Profile.Factory', [])// jshint ignore:line

.factory('ProfileFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Profile Factory';

            service.getProfile = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/config/profile.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
						console.log('THe profile information was not set you need to ensure that you have a /public/config/profile.json file , if you do not this is required to run the application');
                    });
            };
        
         return service;
    }]);
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Search.Factory', [])// jshint ignore:line

.factory('SearchFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Search Factory';

            service.getResults = function (searchText,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/results.json?searchStr='+searchText;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getCategoryProducts = function (id,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/read.json?categoryid='+id;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getBrandProducts = function (id,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/read.json?vendorid='+id;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
         return service;
    }]);
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
'use strict';

angular.module('myApp.module.Main.Home.Controller', ['ngRoute', // jshint ignore:line
												     'myApp.module.Main.Home.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/main', {
						controller: 'MainController',
						templateUrl: 'com/modules/Main/views/home.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Main Dashboard',
						menuGroup: 'Home',
						description: 'This is the Description of the Home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/',title:'VIPER'},{view: '/main',title:'Main Dashboard'}]
			});
		}])


.controller('MainController',// jshint ignore:line
		['$scope', '$rootScope', 'MainFactory',
		function ($scope, $rootScope, MainFactory) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.tmp = MainFactory.message;
            
            //Calendar Variables
            $scope.calendarView = 'month';
            $scope.calendarDate = new Date();
            
            //Calendar Events
            $scope.events = [
              {
                title: 'My event title', // The title of the event
                type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                startsAt: new Date(2013,5,1,1), // A javascript date object for when the event starts
                endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
                editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
                deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                draggable: true, //Allow an event to be dragged and dropped
                resizable: true, //Allow an event to be resizable
                incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
              }
            ];

			
			


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Main.Home.Factory', [])// jshint ignore:line

.factory('MainFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Main Factory';
            service.message = 'This is the placeholder message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Messaging.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Messaging.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/messaging', {
						controller: 'IMController',
						templateUrl: 'com/modules/Messaging/views/messaging.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Messaging Main',
						menuGroup: 'Home',
						description: 'This is The Messaging Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/messaging',title:'VIPER'},{view: '/messaging',title:'Message Main'}]
			});
		}])


.controller('IMController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'IMFactory',
		function ($scope, $rootScope, $location, IMFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = IMFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Messaging.Main.Factory', [])// jshint ignore:line

.factory('IMFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Wiki Factory';

            service.message = 'This is the Wiki Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Profile.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Profile.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/profile', {
						controller: 'ProfileController',
						templateUrl: 'com/modules/Profile/views/profile.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Profile Main',
						menuGroup: 'Home',
						description: 'This is The Profile Page System',
						keywords: 'Profile , Profile Main, Profile Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/profile',title:'Profile'}]
			});
		}])


.controller('ProfileController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'UserProfileFactory',
		function ($scope, $rootScope, $location, UserProfileFactory) {

			$scope.message = 'The Is the Profile Page';
            $rootScope.message = UserProfileFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Profile.Main.Factory', [])// jshint ignore:line

.factory('UserProfileFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Profile Factory';

            service.message = 'This is the Profile Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Reporting.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Reporting.Graph.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/reporting', {
						controller: 'ReportController',
						templateUrl: 'com/modules/Reporting/views/reporting.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Reporting Main',
						menuGroup: 'Home',
						description: 'This is The Reporting Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/reporting',title:'Reporting Main'}]
			});
		}])


.controller('ReportController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'GraphFactory',
		function ($scope, $rootScope, $location, GraphFactory) {

			$scope.message = 'The Is the Wiki Page';

            	$scope.chartType = 'bar';
	
	$scope.config = {
    title: 'Products',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };
	
	
	$scope.config1 = {
		labels: false,
		title: 'Products',
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 110,
		outerRadius: 100
	};

	$scope.config2 = {
		labels: false,
		title: 'HTML-enabled legend',
		legend: {
			display: true,
			htmlEnabled: true,
			position: 'right'
		},
		lineLegend: 'traditional'
	};

	
  //This is the Featured Products System
			GraphFactory.getGraphBanners(function(dataResponse) {
					$scope.data = dataResponse.graph[0];
			});
	
	
			GraphFactory.getGraphBanners2(function(dataResponse) {
					$scope.data1 = dataResponse.graph[0];
			});
	
			GraphFactory.getGraphBanners3(function(dataResponse) {
					$scope.data2 = dataResponse.graph[0];
			});


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Reporting.Graph.Factory', [])// jshint ignore:line

.factory('GraphFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Graph Factory';
        
        
        
            service.getGraphBanners = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph1.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
		
			service.getGraphBanners2 = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph2.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
		
			service.getGraphBanners3 = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph3.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
  
        
         return service;
    }]);
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Reporting.Main.Factory', [])// jshint ignore:line

.factory('ReportFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Report Factory';

            service.message = 'This is the Report Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Support.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Support.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/support', {
						controller: 'SupportController',
						templateUrl: 'com/modules/Support/views/support.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Support Main',
						menuGroup: 'Home',
						description: 'This is The Support Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/support',title:'Support Main'}]
			});
		}])


.controller('SupportController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'SupportFactory',
		function ($scope, $rootScope, $location, SupportFactory) {

			$scope.message = 'The Is the Support Page';
            $rootScope.message = SupportFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Support.Main.Factory', [])// jshint ignore:line

.factory('SupportFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Support Factory';

            service.message = 'This is the Support Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Wiki.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Wiki.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/wiki', {
						controller: 'WikiController',
						templateUrl: 'com/modules/Wiki/views/wiki.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Wiki Main',
						menuGroup: 'Home',
						description: 'This is The Wiki Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/wiki',title:'Wiki Main'}]
			});
		}])


.controller('WikiController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'WikiFactory',
		function ($scope, $rootScope, $location, WikiFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = WikiFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Wiki.Main.Factory', [])// jshint ignore:line

.factory('WikiFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Wiki Factory';

            service.message = 'This is the Wiki Message';
        
         return service;
    }]);