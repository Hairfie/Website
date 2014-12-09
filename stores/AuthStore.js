'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var AuthEvents = require('../constants/AuthConstants').Events;
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');

module.exports = createStore({
    storeName: 'AuthStore',
    handlers: makeHandlers({
        'handleLogin': AuthEvents.LOGIN,
        'handleLoginFailure': AuthEvents.LOGIN_FAILURE,
        'handleLoginSuccess': [AuthEvents.LOGIN_SUCCESS, AuthEvents.SIGNUP_SUCCESS],
        'handleLogoutSuccess': AuthEvents.LOGOUT_SUCCESS,
        'handleReceiveManagedBusinessesSuccess': BusinessEvents.RECEIVE_MANAGED_SUCCESS,
        'handleClaimSuccess': BusinessEvents.CLAIM_SUCCESS
    }),
    initialize: function () {
        this.loginInProgress = false;
        this.user = null;
        this.token = null;
        this.managedBusinesses = [];
    },
    dehydrate: function () {
        return {
            user                : this.user,
            token               : this.token,
            managedBusinesses   : this.managedBusinesses
        };
    },
    rehydrate: function (state) {
        this.user = state.user;
        this.token = state.token;
        this.managedBusinesses = state.managedBusinesses;
    },
    handleLogin: function (payload) {
        this.loginInProgress = true;
        this.emitChange();
    },
    handleLoginSuccess: function (payload) {
        this.user = payload.user;
        this.token = payload.token;
        this.loginInProgress = false;

        if (payload.managedBusinesses) {
            this.managedBusinesses = payload.managedBusinesses;
        } else {
            this._refreshManagedBusinesses();
        }

        this.emitChange();
    },
    handleLoginFailure: function (payload) {
        this.loginInProgress = false;
        this.emitChange();
    },
    handleLogoutSuccess: function (payload) {
        this.user = this.token = this.managedBusinesses = null;
        this.emitChange();
    },
    handleReceiveManagedBusinessesSuccess: function (payload) {
        // check credentials are still valid for the list
        if (!this.user || !this.token || this.user.id != payload.user.id || this.token.id != payload.token.id) {

            return;
        }

        this.managedBusinesses = payload.businesses;
        this.emitChange();
    },
    handleClaimSuccess: function (payload) {
        // lazy way: let's reload the managed businesses list
        this._refreshManagedBusinesses();
    },
    getUser: function () {
        return this.user;
    },
    getToken: function () {
        return this.token;
    },
    isLoginInProgress: function () {
        return this.loginInProgress;
    },
    getManagedBusinesses: function () {
        return this.managedBusinesses || [];
    },
    _refreshManagedBusinesses: function () {
        this.dispatcher.getContext().executeAction(BusinessActions.RefreshManaged, {
            user    : this.user,
            token   : this.token
        });
    }
});
