'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'AuthStore',
    handlers: makeHandlers({
        onReceiveToken: Actions.RECEIVE_TOKEN,
        onDeleteToken: Actions.DELETE_TOKEN
    }),
    initialize: function () {
        this.tokens = {};
    },
    dehydrate: function () {
        return { tokens: this.tokens };
    },
    rehydrate: function (state) {
        this.tokens = state.tokens;
    },
    onReceiveToken: function (token) {
        this.tokens = token;
        this.emitChange();
    },
    onDeleteToken: function() {
        this.token = {};
        this.emitChange();
    },
    getToken: function () {
        return this.tokens;
    }
});
