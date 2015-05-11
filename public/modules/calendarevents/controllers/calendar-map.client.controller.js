'use strict';

angular.module('calendarevents').controller('CalendarMapController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents', 'Geolocation',
    function($scope, $stateParams, $location, Authentication, Calendarevents, Geolocation) {
        $scope.authentication = Authentication;

        // Coordinates for Helsinki
        var latitude = 60.192059;
        var longitude = 24.945831;
        var zoom = 5;


        function updateMap(address) {
            Geolocation.getGeolocation(address).success(function(data, status, headers, config) {
                latitude = parseFloat(data[0].lat);
                longitude = parseFloat(data[0].lon);
                zoom = 15;

                angular.extend($scope, {
                    center: {
                        lat: latitude,
                        lng: longitude,
                        zoom: zoom
                    },
                    markers: {
                        eventMarker: {
                            lat: latitude,
                            lng: longitude,
                            message: address,
                            focus: true,
                            draggable: false
                        }
                    },
                    defaults: {
                        scrollWheelZoom: false
                    }
                });
            });
        }


        // Find existing Calendarevent
        $scope.findOne = function() {
            $scope.calendarevent =
                Calendarevents.get({
                    calendareventId: $stateParams.calendareventId
                }, function() {
                    if ($scope.calendarevent.address !== undefined) {
                        var address = $scope.calendarevent.address;
                        updateMap(address);
                    }
                });
        };


        angular.extend($scope, {
            center: {
                lat: latitude,
                lng: longitude,
                zoom: zoom
            },
            markers: {},
            defaults: {
                scrollWheelZoom: false
            }
        });

    }
]);
