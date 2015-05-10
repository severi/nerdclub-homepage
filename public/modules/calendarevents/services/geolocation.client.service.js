'use strict';

angular.module('calendarevents').factory('Geolocation', ['$http',
    function($http) {
        // Geolocation service logic
        // ...

        // Public API
        return {
            getGeolocation: function() {
                return $http.get('http://nominatim.openstreetmap.org/search/Unter%20den%20Linden%201%20Berlin?format=json&addressdetails=1&limit=1&polygon_svg=1');
            }
        };
    }
]);
