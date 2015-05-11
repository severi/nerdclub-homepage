'use strict';

angular.module('calendarevents').factory('Geolocation', ['$http',
    function($http) {
        // Geolocation service logic
        // ...

        // Public API
        return {
            getGeolocation: function(address) {
                console.log(address+" <- address");
                return $http.get('http://nominatim.openstreetmap.org/search/'+address+'?format=json&addressdetails=1&limit=1&polygon_svg=1');
            }
        };
    }
]);
