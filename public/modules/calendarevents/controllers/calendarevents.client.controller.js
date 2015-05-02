'use strict';

// Calendarevents controller
angular.module('calendarevents').controller('CalendareventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents',
    function($scope, $stateParams, $location, Authentication, Calendarevents) {
        $scope.authentication = Authentication;

        // Create new Calendarevent
        $scope.create = function() {
            // Create new Calendarevent object
            var calendarevent = new Calendarevents({
                name: this.name,
                description: this.description,
                startDate: this.startDate,
                endDate: this.endDate
            });

            // Redirect after save
            calendarevent.$save(function(response) {
                $location.path('calendarevents/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.description = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Calendarevent
        $scope.remove = function(calendarevent) {
            if (calendarevent) {
                calendarevent.$remove();

                for (var i in $scope.calendarevents) {
                    if ($scope.calendarevents[i] === calendarevent) {
                        $scope.calendarevents.splice(i, 1);
                    }
                }
            } else {
                $scope.calendarevent.$remove(function() {
                    $location.path('calendarevents');
                });
            }
        };

        // Update existing Calendarevent
        $scope.update = function() {
            var calendarevent = $scope.calendarevent;

            calendarevent.$update(function() {
                $location.path('calendarevents/' + calendarevent._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Calendarevents
        $scope.find = function() {
            $scope.calendarevents = Calendarevents.query();
        };

        // Find existing Calendarevent
        $scope.findOne = function() {
            $scope.calendarevent = Calendarevents.get({
                calendareventId: $stateParams.calendareventId
            });
        };

        $scope.participate = function(calendarevent) {
            console.log(calendarevent.participants);
            var exists=false;
            for(var i = 0; i < calendarevent.participants.length; i++) {
                if (Authentication.user._id === calendarevent.participants[i]){
                    exists=true;
                    calendarevent.participants.splice(i,1);
                }
            }
            if (exists==false){
                calendarevent.participants.push(Authentication.user._id);
            }

            calendarevent.$update(function() {
                //successfull
            }, function(errorResponse) {
                console.log("error...");
                $scope.error = errorResponse.data.message;
            });

        };
    }
]);
