'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var calendarevents = require('../../app/controllers/calendarevents.server.controller');

	// Calendarevents Routes
	app.route('/calendarevents')
		.get(calendarevents.list)
		.post(users.requiresLogin, calendarevents.create);

	app.route('/calendarevents/:calendareventId')
		.get(calendarevents.read)
		.put(users.requiresLogin, calendarevents.hasAuthorization, calendarevents.update)
		.delete(users.requiresLogin, calendarevents.hasAuthorization, calendarevents.delete);

	// Finish by binding the Calendarevent middleware
	app.param('calendareventId', calendarevents.calendareventByID);
};
