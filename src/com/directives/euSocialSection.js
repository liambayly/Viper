
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