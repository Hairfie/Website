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

        'RECEIVE_HAIRDRESSERS',
        'RECEIVE_HAIRDRESSERS_SUCCESS',
        'RECEIVE_HAIRDRSSERS_FAILURE',

        'RECEIVE_FACEBOOK_PAGE_SUCCESS',

        'CLAIM_EXISTING',
        'CLAIM_EXISTING_SUCCESS',
        'CLAIM_EXISTING_FAILURE',

        'CLAIM',
        'CLAIM_SUCCESS',
        'CLAIM_FAILURE',

        'FETCH_SEARCH_RESULT',
        'FETCH_SEARCH_RESULT_SUCCESS',
        'FETCH_SEARCH_RESULT_FAILURE'
    ]),
    Kinds: define([
        'SALON',
        'HOME'
    ])
};
