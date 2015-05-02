'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calendarevent = mongoose.model('Calendarevent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, calendarevent;

/**
 * Calendarevent routes tests
 */
describe('Calendarevent CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Calendarevent
		user.save(function() {
			calendarevent = {
				name: 'Calendarevent Name'
			};

			done();
		});
	});

	it('should be able to save Calendarevent instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendarevent
				agent.post('/calendarevents')
					.send(calendarevent)
					.expect(200)
					.end(function(calendareventSaveErr, calendareventSaveRes) {
						// Handle Calendarevent save error
						if (calendareventSaveErr) done(calendareventSaveErr);

						// Get a list of Calendarevents
						agent.get('/calendarevents')
							.end(function(calendareventsGetErr, calendareventsGetRes) {
								// Handle Calendarevent save error
								if (calendareventsGetErr) done(calendareventsGetErr);

								// Get Calendarevents list
								var calendarevents = calendareventsGetRes.body;

								// Set assertions
								(calendarevents[0].user._id).should.equal(userId);
								(calendarevents[0].name).should.match('Calendarevent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Calendarevent instance if not logged in', function(done) {
		agent.post('/calendarevents')
			.send(calendarevent)
			.expect(401)
			.end(function(calendareventSaveErr, calendareventSaveRes) {
				// Call the assertion callback
				done(calendareventSaveErr);
			});
	});

	it('should not be able to save Calendarevent instance if no name is provided', function(done) {
		// Invalidate name field
		calendarevent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendarevent
				agent.post('/calendarevents')
					.send(calendarevent)
					.expect(400)
					.end(function(calendareventSaveErr, calendareventSaveRes) {
						// Set message assertion
						(calendareventSaveRes.body.message).should.match('Please fill Calendarevent name');
						
						// Handle Calendarevent save error
						done(calendareventSaveErr);
					});
			});
	});

	it('should be able to update Calendarevent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendarevent
				agent.post('/calendarevents')
					.send(calendarevent)
					.expect(200)
					.end(function(calendareventSaveErr, calendareventSaveRes) {
						// Handle Calendarevent save error
						if (calendareventSaveErr) done(calendareventSaveErr);

						// Update Calendarevent name
						calendarevent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Calendarevent
						agent.put('/calendarevents/' + calendareventSaveRes.body._id)
							.send(calendarevent)
							.expect(200)
							.end(function(calendareventUpdateErr, calendareventUpdateRes) {
								// Handle Calendarevent update error
								if (calendareventUpdateErr) done(calendareventUpdateErr);

								// Set assertions
								(calendareventUpdateRes.body._id).should.equal(calendareventSaveRes.body._id);
								(calendareventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Calendarevents if not signed in', function(done) {
		// Create new Calendarevent model instance
		var calendareventObj = new Calendarevent(calendarevent);

		// Save the Calendarevent
		calendareventObj.save(function() {
			// Request Calendarevents
			request(app).get('/calendarevents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Calendarevent if not signed in', function(done) {
		// Create new Calendarevent model instance
		var calendareventObj = new Calendarevent(calendarevent);

		// Save the Calendarevent
		calendareventObj.save(function() {
			request(app).get('/calendarevents/' + calendareventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', calendarevent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Calendarevent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendarevent
				agent.post('/calendarevents')
					.send(calendarevent)
					.expect(200)
					.end(function(calendareventSaveErr, calendareventSaveRes) {
						// Handle Calendarevent save error
						if (calendareventSaveErr) done(calendareventSaveErr);

						// Delete existing Calendarevent
						agent.delete('/calendarevents/' + calendareventSaveRes.body._id)
							.send(calendarevent)
							.expect(200)
							.end(function(calendareventDeleteErr, calendareventDeleteRes) {
								// Handle Calendarevent error error
								if (calendareventDeleteErr) done(calendareventDeleteErr);

								// Set assertions
								(calendareventDeleteRes.body._id).should.equal(calendareventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Calendarevent instance if not signed in', function(done) {
		// Set Calendarevent user 
		calendarevent.user = user;

		// Create new Calendarevent model instance
		var calendareventObj = new Calendarevent(calendarevent);

		// Save the Calendarevent
		calendareventObj.save(function() {
			// Try deleting Calendarevent
			request(app).delete('/calendarevents/' + calendareventObj._id)
			.expect(401)
			.end(function(calendareventDeleteErr, calendareventDeleteRes) {
				// Set message assertion
				(calendareventDeleteRes.body.message).should.match('User is not logged in');

				// Handle Calendarevent error error
				done(calendareventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Calendarevent.remove().exec();
		done();
	});
});