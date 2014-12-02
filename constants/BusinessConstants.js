'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS', [
        'OPEN',
        'OPEN_SUCCESS',
        'OPEN_FAILURE',

        'SAVE',
        'SAVE_SUCCESS',
        'SAVE_FAILURE',

        'RECEIVE_MANAGED',
        'RECEIVE_MANAGED_SUCCESS',
        'RECEIVE_MANAGED_FAILURE',

        'RECEIVE_HAIRDRESSERS',
        'RECEIVE_HAIRDRESSERS_SUCCESS',
        'RECEIVE_HAIRDRESSERS_FAILURE'
    ]),
    Kinds: define([
        'SALON',
        'HOME'
    ])
};
