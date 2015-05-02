'use strict';

//Calendarevents service used to communicate Calendarevents REST endpoints
angular.module('calendarevents').factory('Calendarevents', ['$resource',
	function($resource) {
		return $resource('calendarevents/:calendareventId', { calendareventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);