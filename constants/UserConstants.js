'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('USER', [
        'RECEIVE_SUGGESTIONS',
        'RECEIVE_SUGGESTIONS_SUCCESS',
        'RECEIVE_SUGGESTIONS_FAILURE',

        'RECEIVE_MANAGED_BUSINESSES_SUCCESS'
    ]),
    Genders: define([
        'MALE',
        'FEMALE'
    ])
};
