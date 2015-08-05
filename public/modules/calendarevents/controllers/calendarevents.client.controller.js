'use strict';

// Calendarevents controller
angular.module('calendarevents').controller('CalendareventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents',
    function($scope, $stateParams, $location, Authentication, Calendarevents) {
        $scope.authentication = Authentication;

        // Create new Calendarevent
        function readDatetimeFromForm(dateForm,timeForm) {
            var datetime = null;
            if (dateForm){
                datetime = new Date(dateForm);
                if (timeForm){
                    var time = timeForm.split(':');
                    datetime.setHours(time[0]);
                    datetime.setMinutes(time[1]);
                }
            }
            return datetime;
        }

        // DELETE THIS? now in modalInstance Controller
        $scope.create = function() {
            // Create new Calendarevent object
            var dateFrom= readDatetimeFromForm(this.startDate, this.startTime);
            var dateTo= readDatetimeFromForm(this.endDate, this.endTime);

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
