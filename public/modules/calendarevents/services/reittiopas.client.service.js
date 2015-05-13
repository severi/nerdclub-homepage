'use strict';

angular.module('calendarevents').factory('Reittiopas', ['$http',
    function($http) {
        // Reittiopas service logic
        // ...

        // Public API
        return {
            getRoute: function() {
                return $http.get('http://api.reittiopas.fi/hsl/prod/?request=route&user=severi&pass=n0rttikerh0&format=json&from=25.142606664271,60.210198019978&to=24.930525730128,60.168132701388&show=1&detail=limited&epsg_out=wgs84&epsg_in=wgs84');
            }

        };
    }
]);
