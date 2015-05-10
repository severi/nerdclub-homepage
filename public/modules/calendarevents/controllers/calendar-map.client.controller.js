'use strict';

angular.module('calendarevents').controller('CalendarMapController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents', 'Geolocation',
    function($scope, $stateParams, $location, Authentication, Calendarevents, Geolocation) {
        $scope.authentication = Authentication;

        var latitude = 0;
        var longitude = 0;

        Geolocation.getGeolocation().
        success(function(data, status, headers, config) {
            latitude = parseFloat(data[0].lat);
            longitude = parseFloat(data[0].lon);

            angular.extend($scope, {
                center: {
                    lat: latitude,
                    lng: longitude,
                    zoom: 6
                },
                defaults: {
                    scrollWheelZoom: false
                }
            });

        });

        angular.extend($scope, {
            center: {
                lat: latitude,
                lng: longitude,
                zoom: 6
            },
            defaults: {
                scrollWheelZoom: false
            }
        });

    }
]);
