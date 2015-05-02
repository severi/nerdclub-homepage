'use strict';

(function() {
	// Calendarevents Controller Spec
	describe('Calendarevents Controller Tests', function() {
		// Initialize global variables
		var CalendareventsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Calendarevents controller.
			CalendareventsController = $controller('CalendareventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Calendarevent object fetched from XHR', inject(function(Calendarevents) {
			// Create sample Calendarevent using the Calendarevents service
			var sampleCalendarevent = new Calendarevents({
				name: 'New Calendarevent'
			});

			// Create a sample Calendarevents array that includes the new Calendarevent
			var sampleCalendarevents = [sampleCalendarevent];

			// Set GET response
			$httpBackend.expectGET('calendarevents').respond(sampleCalendarevents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendarevents).toEqualData(sampleCalendarevents);
		}));

		it('$scope.findOne() should create an array with one Calendarevent object fetched from XHR using a calendareventId URL parameter', inject(function(Calendarevents) {
			// Define a sample Calendarevent object
			var sampleCalendarevent = new Calendarevents({
				name: 'New Calendarevent'
			});

			// Set the URL parameter
			$stateParams.calendareventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/calendarevents\/([0-9a-fA-F]{24})$/).respond(sampleCalendarevent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendarevent).toEqualData(sampleCalendarevent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Calendarevents) {
			// Create a sample Calendarevent object
			var sampleCalendareventPostData = new Calendarevents({
				name: 'New Calendarevent'
			});

			// Create a sample Calendarevent response
			var sampleCalendareventResponse = new Calendarevents({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendarevent'
			});

			// Fixture mock form input values
			scope.name = 'New Calendarevent';

			// Set POST response
			$httpBackend.expectPOST('calendarevents', sampleCalendareventPostData).respond(sampleCalendareventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Calendarevent was created
			expect($location.path()).toBe('/calendarevents/' + sampleCalendareventResponse._id);
		}));

		it('$scope.update() should update a valid Calendarevent', inject(function(Calendarevents) {
			// Define a sample Calendarevent put data
			var sampleCalendareventPutData = new Calendarevents({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendarevent'
			});

			// Mock Calendarevent in scope
			scope.calendarevent = sampleCalendareventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/calendarevents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/calendarevents/' + sampleCalendareventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid calendareventId and remove the Calendarevent from the scope', inject(function(Calendarevents) {
			// Create new Calendarevent object
			var sampleCalendarevent = new Calendarevents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Calendarevents array and include the Calendarevent
			scope.calendarevents = [sampleCalendarevent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/calendarevents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCalendarevent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.calendarevents.length).toBe(0);
		}));
	});
}());