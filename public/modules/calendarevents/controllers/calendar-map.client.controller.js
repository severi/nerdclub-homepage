'use strict';

angular.module('calendarevents').controller('CalendarMapController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents',
    function($scope, $stateParams, $location, Authentication, Calendarevents) {
        $scope.authentication = Authentication;

        angular.extend($scope, {
            center: {
                lat: 40.095,
                lng: -3.823,
                zoom: 6
            },
            defaults: {
                scrollWheelZoom: false
            }
        });
    }
]);
