'use strict';

angular.module('calendarevents').factory('Reittiopas', ['$http',
    function($http) {
        // Reittiopas service logic
        // ...

        // Public API
        return {
            getRoute: function(toLng, toLat, fromLng, fromLat) {
                var fromCoord =  fromLng+','+fromLat;
                var toCoord =  toLng+','+toLat;
                var address = 'http://api.reittiopas.fi/hsl/prod/?request=route&user=severi&pass=n0rttikerh0&format=json&show=1&full=limited&epsg_out=wgs84&epsg_in=wgs84';
                return $http.get(address, {
                    params: {
                        from: fromCoord,
                        to: toCoord
                    }
                });
            }


        };
    }
]);
