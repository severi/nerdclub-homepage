'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Calendarevent = mongoose.model('Calendarevent'),
	_ = require('lodash');

/**
 * Create a Calendarevent
 */
exports.create = function(req, res) {
	var calendarevent = new Calendarevent(req.body);
	calendarevent.user = req.user;

	calendarevent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarevent);
		}
	});
};

/**
 * Show the current Calendarevent
 */
exports.read = function(req, res) {
	res.jsonp(req.calendarevent);
};

/**
 * Update a Calendarevent
 */
exports.update = function(req, res) {
	var calendarevent = req.calendarevent ;

	calendarevent = _.extend(calendarevent , req.body);

	calendarevent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarevent);
		}
	});
};

/**
 * Delete an Calendarevent
 */
exports.delete = function(req, res) {
	var calendarevent = req.calendarevent ;

	calendarevent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarevent);
		}
	});
};

/**
 * List of Calendarevents
 */
exports.list = function(req, res) {
	Calendarevent.find().sort('-created').populate('user', 'displayName').populate('participants','displayName').exec(function(err, calendarevents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarevents);
		}
	});
};

/**
 * Calendarevent middleware
 */
exports.calendareventByID = function(req, res, next, id) {
	Calendarevent.findById(id).populate('user', 'displayName').populate('participants','displayName').exec(function(err, calendarevent) {
		if (err) return next(err);
		if (! calendarevent) return next(new Error('Failed to load Calendarevent ' + id));
		req.calendarevent = calendarevent ;
		next();
	});
};

/**
 * Calendarevent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.calendarevent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
