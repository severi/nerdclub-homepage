'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Calendarevent Schema
 */
var CalendareventSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Calendarevent name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    created: {
	type: Date,
	default: Date.now
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    participants: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]

});

mongoose.model('Calendarevent', CalendareventSchema);
