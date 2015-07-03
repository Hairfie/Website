'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'TokenStore',
    handlers: makeHandlers({
        onReceiveToken: Actions.RECEIVE_TOKEN
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
    getToken: function () {
        return this.tokens;
    }
});
