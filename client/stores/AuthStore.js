'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
    storeName: 'AuthStore',
    init: function () {
        this.loginInProgress = false;
        this.user = null;
        this.token = null;
    },
    handlers: {
        'RECEIVE_LOGIN': 'handleLogin',
        'RECEIVE_LOGIN_SUCCESS': 'handleLoginSuccess',
        'RECEIVE_LOGIN_FAILURE': 'handleLoginFailure',
        'RECEIVE_LOGOUT_SUCCESS': 'handleLogoutSuccess',
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
