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
