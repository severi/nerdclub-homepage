'use strict';

//Setting up route
angular.module('calendarevents').config(['$stateProvider',
	function($stateProvider) {
		// Calendarevents state routing
		$stateProvider.
		state('listCalendarevents', {
			url: '/calendarevents',
			templateUrl: 'modules/calendarevents/views/list-calendarevents.client.view.html'
		}).
		state('createCalendarevent', {
			url: '/calendarevents/create',
			templateUrl: 'modules/calendarevents/views/create-calendarevent.client.view.html'
		}).
		state('viewCalendarevent', {
			url: '/calendarevents/:calendareventId',
			templateUrl: 'modules/calendarevents/views/view-calendarevent.client.view.html'
		}).
		state('editCalendarevent', {
			url: '/calendarevents/:calendareventId/edit',
			templateUrl: 'modules/calendarevents/views/edit-calendarevent.client.view.html'
		});
	}
]);