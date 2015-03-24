'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('HAIRFIE', [
        'RECEIVE',
        'RECEIVE_SUCCESS',
        'RECEIVE_FAILURE',

        'RECEIVE_TOP',
        'RECEIVE_TOP_SUCCESS',
        'RECEIVE_TOP_FAILURE',

        'DELETE',
        'DELETE_SUCCESS',
        'DELETE_FAILURE',

        'LIST',
        'LIST_SUCCESS',
        'LIST_FAILURE',

        'FETCH_QUERY_SUCCESS',
        'FETCH_QUERY_FAILURE',
    ])
};
