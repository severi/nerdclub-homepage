'use strict';

angular.module('calendarevents').controller('CalendarMapController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendarevents', 'Geolocation', 'Reittiopas',
    function($scope, $stateParams, $location, Authentication, Calendarevents, Geolocation, Reittiopas) {
        $scope.authentication = Authentication;

        // Coordinates for Helsinki
        var latitude = 60.192059;
        var longitude = 24.945831;
        var zoom = 5;

        var mapConfig = {
            center: {
                lat: latitude,
                lng: longitude,
                zoom: zoom
            },
            markers: {},
            defaults: {
                scrollWheelZoom: false
            }
        };


        function updateMap(address) {
            Geolocation.getGeolocation(address).success(function(data, status, headers, config) {
                latitude = parseFloat(data[0].lat);
                longitude = parseFloat(data[0].lon);
                zoom = 15;

                mapConfig.center.lat = latitude;
                mapConfig.center.lng = longitude;
                mapConfig.center.zoom = zoom;
                mapConfig.markers["eventMarker"] = {
                    lat: latitude,
                    lng: longitude,
                    message: address,
                    focus: true,
                    draggable: false
                };

                Reittiopas.getRoute(longitude, latitude).success(function(data, status, headers, config) {
                    console.log(mapConfig);
                    var legs = data[0][0].legs;
                    for (var i = 0; i < legs.length; i++) {
                        for (var j = 0; j < legs[i].locs.length; j++) {
                            var coord = legs[i].locs[j].coord;
                            var legLon = coord.x;
                            var legLat = coord.y;
                            mapConfig.markers["marker_"+i+"_"+j]={
                                lat:legLat,
                                lng: legLon,
                                message: "marker_"+i+"_"+j,
                                focus: false,
                                draggable:false
                            };
                        }
                    }
                    angular.extend($scope,mapConfig);
                });

                angular.extend($scope, mapConfig);
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
