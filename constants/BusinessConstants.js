'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS', [
        'OPEN',
        'OPEN_WITH_BAD_SLUG',
        'OPEN_SUCCESS',
        'OPEN_FAILURE',

        'RECEIVE',
        'RECEIVE_SUCCESS',
        'RECEIVE_FAILURE',

        'FETCH_SEARCH_RESULT',
        'FETCH_SEARCH_RESULT_SUCCESS',
        'FETCH_SEARCH_RESULT_FAILURE',

        'FETCH_SIMILAR_SUCCESS'
    ]),
    Kinds: define([
        'SALON',
        'HOME'
    ])
};
