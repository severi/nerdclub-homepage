'use strict';

// Configuring the Articles module
angular.module('calendarevents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Calendarevents', 'calendarevents', 'dropdown', '/calendarevents(/create)?');
		Menus.addSubMenuItem('topbar', 'calendarevents', 'List Calendarevents', 'calendarevents');
		Menus.addSubMenuItem('topbar', 'calendarevents', 'New Calendarevent', 'calendarevents/create');
	}
]);