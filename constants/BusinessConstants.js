'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS', [
        'OPEN',
        'OPEN_WITH_BAD_SLUG',
        'OPEN_SUCCESS',
        'OPEN_FAILURE',

        'RECEIVE_SUCCESS',

        'RECEIVE_HAIRDRESSERS',
        'RECEIVE_HAIRDRESSERS_SUCCESS',
        'RECEIVE_HAIRDRSSERS_FAILURE',

        'RECEIVE_FACEBOOK_PAGE_SUCCESS',

        'ADD_PICTURE',
        'ADD_PICTURE_SUCCESS',
        'ADD_PICTURE_FAILURE',

        'CLAIM',
        'CLAIM_SUCCESS',
        'CLAIM_FAILURE'
    ]),
    Kinds: define([
        'SALON',
        'HOME'
    ])
};
