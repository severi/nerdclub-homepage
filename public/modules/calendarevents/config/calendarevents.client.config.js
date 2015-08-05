'use strict';

// Configuring the Articles module
angular.module('calendarevents').run(['Menus',
	function(Menus) {
	    // Set top bar menu items
            Menus.addMenuItem('topbar', 'Calendarevents', 'calendarevents', 'item');
	}
]);
