'use strict';

// Calendarevents controller
angular.module('calendarevents').controller('CalendareventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents',
    function($scope, $stateParams, $location, Authentication, Calendarevents) {
        $scope.authentication = Authentication;

        // Create new Calendarevent
        $scope.create = function() {
            // Create new Calendarevent object
            var dateFrom=null;
            if (dateFrom){
                dateFrom = new Date(this.startDate);
                if (this.startTime){
                    var time = this.startTime.split(':');
                    dateFrom.setHours(time[0]);
                    dateFrom.setMinutes(time[1]);
                }
            }

            var dateTo=null;
            if (this.endDate){
                dateTo = new Date(this.endDate);
                if (this.endTime){
                    var time = this.endTime.split(':');
                    dateTo.setHours(time[0]);
                    dateTo.setMinutes(time[1]);
                }
            }


            var calendarevent = new Calendarevents({
                name: this.name,
                description: this.description,
                startDate: dateFrom,
                endDate: dateTo,
                address: this.address
            });

            // Redirect after save
            calendarevent.$save(function(response) {
                $location.path('calendarevents/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.description = '';
                $scope.address = '';
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
            var exists=false;
            for(var i = 0; i < calendarevent.participants.length; i++) {
                if (Authentication.user._id === calendarevent.participants[i]._id){
                    exists=true;
                    calendarevent.participants.splice(i,1);
                }
            }
            if (exists===false){
                calendarevent.participants.push(Authentication.user);
            }

            calendarevent.$update(function() {
                //successfull
            }, function(errorResponse) {
                console.log('error...');
                $scope.error = errorResponse.data.message;
            });
        };

        function getDay(d){
            var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            return days[d.getDay()];
        }

        function getDate(d){
            return d.getDate().toString()+'.'+(1+d.getMonth()).toString()+'.'+d.getFullYear().toString();
        }
        function getTime(d){
            return d.toLocaleTimeString();
        }

        $scope.getDateString = function(date){
            if (date===undefined){
                return '';
            }
            var d = new Date(date);
            return getDay(d)+' '+getDate(d)+' '+getTime(d);
        };



        $scope.isParticipating = function(calendarevent) {

            for(var i = 0; i < calendarevent.participants.length; i++) {
                if (Authentication.user._id === calendarevent.participants[i]._id){
                    return true;
                }
            }
            return false;
        };



    }
]);
