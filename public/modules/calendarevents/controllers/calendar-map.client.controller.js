'use strict';

angular.module('calendarevents').controller('CalendarMapController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents', 'Geolocation', 'Reittiopas',
    function($scope, $stateParams, $location, Authentication, Calendarevents, Geolocation, Reittiopas) {
        $scope.authentication = Authentication;

        // Coordinates for Helsinki
        var default_coordinate = {};
        default_coordinate.latitude = 60.192059;
        default_coordinate.longitude = 24.945831;

        var latitude = default_coordinate.latitude;
        var longitude = default_coordinate.longitude;
        var zoom = 5;

        var userLatitude = latitude;
        var userLongitude = longitude;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
            });
        }

        var mapConfig = {
            center: {
                lat: latitude,
                lng: longitude,
                zoom: zoom
            },
            markers: {},
            paths: {},
            defaults: {
                scrollWheelZoom: false
            }
        };

        angular.extend($scope, mapConfig);

        function getRoute(t_lng, t_lat, c_lng, c_lat, repeat) {
            Reittiopas.getRoute(t_lng, t_lat, c_lng, c_lat).success(function(data, status, headers, config) {
                var last = {};
                if (data.length === 0) {
                    if (repeat === true) {
                        getRoute(t_lng, t_lat, default_coordinate.longitude, default_coordinate.latitude, false);
                    }
                } else {
                    var legs = data[0][0].legs;

                    for (var i = 0; i < legs.length; i++) {
                        var type = legs[i].type;
                        var color = 'blue';
                        var walk = 'walk';
                        if (walk.includes(type)) {
                            color = 'red';
                        }
                        mapConfig.paths['path_' + i] = {
                            color: color,
                            weight: 4,
                            latlngs: [],
                        };

                        for (var j = 0; j < legs[i].locs.length; j++) {
                            var coord = legs[i].locs[j].coord;
                            mapConfig.paths['path_' + i].latlngs.push({
                                lat: coord.y,
                                lng: coord.x
                            });
                        }
                    }

                    last = legs[legs.length - 1];
                    last = last.locs[last.locs.length - 1].coord;
                }
                mapConfig.markers.locationMarker = {
                    lat: last.y,
                    lng: last.x,
                    focus: false,
                    draggable: false
                };

                angular.extend($scope, mapConfig);

            });
        }

        function updateMap(address) {
            Geolocation.getGeolocation(address).success(function(data, status, headers, config) {
                latitude = parseFloat(data[0].lat);
                longitude = parseFloat(data[0].lon);
                zoom = 10;
                mapConfig.center.lat = latitude;
                mapConfig.center.lng = longitude;
                mapConfig.center.zoom = zoom;
                mapConfig.markers.eventMarker = {
                    lat: latitude,
                    lng: longitude,
                    message: address,
                    focus: true,
                    draggable: false
                };

                getRoute(longitude, latitude, userLatitude, userLatitude, true);
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
    }
]);
