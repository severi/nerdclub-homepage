'use strict';

angular.module('calendarevents').directive('createEvent', [
    function() {
        return {
            templateUrl: '/modules/calendarevents/views/create-event-dialog.client.view.html',
            restrict: 'E'
        };
    }
]);
