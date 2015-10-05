'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');
var authStorage = require('../services/auth-storage');

module.exports = createStore({
    storeName: 'AuthStore',
    handlers: makeHandlers({
        onReceiveToken: Actions.RECEIVE_TOKEN,
        onDeleteToken: Actions.DELETE_TOKEN,
        onClosedPopupStatusChange: Actions.CLOSED_POPUP_STATUS
    }),
    initialize: function () {
        this.tokens = {};
        this.closesPopupStatus = false;
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
        this.tokens = {};
        this.emitChange();
    },
    getToken: function () {
        return this.tokens;
    },
    onClosedPopupStatusChange: function(status) {
        this.closesPopupStatus = status;
    },
    getClosedPopupStatus: function() {
        return this.closesPopupStatus;
    }
});
