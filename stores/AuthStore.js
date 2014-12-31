'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var AuthEvents = require('../constants/AuthConstants').Events;

module.exports = createStore({
    storeName: 'AuthStore',
    handlers: makeHandlers({
        handleLogin: AuthEvents.LOGIN,
        handleLoginFailure: AuthEvents.LOGIN_FAILURE,
        handleLoginSuccess: [AuthEvents.LOGIN_SUCCESS, AuthEvents.SIGNUP_SUCCESS],
        handleLogoutSuccess: AuthEvents.LOGOUT_SUCCESS
    }),
    initialize: function () {
        this.loginInProgress = false;
        this.user = null;
        this.token = null;
    },
    dehydrate: function () {
        return {
            user    : this.user,
            token   : this.token,
        };
    },
    rehydrate: function (state) {
        this.user = state.user;
        this.token = state.token;
    },
    handleLogin: function (payload) {
        this.loginInProgress = true;
        this.emitChange();
    },
    handleLoginSuccess: function (payload) {
        this.user = payload.user;
        this.token = payload.token;
        this.loginInProgress = false;
        this.emitChange();
    },
    handleLoginFailure: function (payload) {
        this.loginInProgress = false;
        this.emitChange();
    },
    handleLogoutSuccess: function (payload) {
        this.user = this.token = null;
        this.emitChange();
    },
    getUser: function () {
        return this.user;
    },
    getToken: function () {
        return this.token;
    },
    isLoginInProgress: function () {
        return this.loginInProgress;
    }
});
