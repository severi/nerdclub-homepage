'use strict';

angular.module('calendarevents').factory('Reittiopas', ['$http',
    function($http) {
        // Reittiopas service logic
        // ...

        // Public API
        return {
            getRoute: function(xLongitude, yLatitude) {
                var address = 'http://api.reittiopas.fi/hsl/prod/?request=route&user=severi&pass=n0rttikerh0&format=json&from=' + xLongitude + ',' + yLatitude + '&to=25.14195,60.20963&show=1&full=limited&epsg_out=wgs84&epsg_in=wgs84';
                console.log(address);
                return $http.get(address);
            }


        };
    }
]);
