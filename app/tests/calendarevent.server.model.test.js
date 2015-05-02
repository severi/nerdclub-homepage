'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calendarevent = mongoose.model('Calendarevent');

/**
 * Globals
 */
var user, calendarevent;

/**
 * Unit tests
 */
describe('Calendarevent Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			calendarevent = new Calendarevent({
				name: 'Calendarevent Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return calendarevent.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			calendarevent.name = '';

			return calendarevent.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Calendarevent.remove().exec();
		User.remove().exec();

		done();
	});
});