'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var AuthActions = require('../actions/Auth');
var AuthEvents = require('../constants/AuthConstants').Events;

module.exports = createStore({
    storeName: 'PasswordRecoveryStore',
    initialize: function () {
        this.statuses = {};
    },
    handlers: makeHandlers({
        handleStartPasswordRecoverySuccess: AuthEvents.START_PASSWORD_RECOVERY_SUCCESS,
        handleStartPasswordRecoveryFailure: AuthEvents.START_PASSWORD_RECOVERY_FAILURE,
        handleResetPassword: AuthEvents.RESET_PASSWORD,
        handleResetPasswordSuccess: AuthEvents.RESET_PASSWORD_SUCCESS,
        handleResetPasswordFailure: AuthEvents.RESET_PASSWORD_FAILURE
    }),
    handleStartPasswordRecoverySuccess: function (payload) {
        var key = this._key(payload.userId, payload.token);

        this.statuses[key].started = true;
        this.statuses[key].user = payload.user;

        this.emitChange();
    },
    handleStartPasswordRecoveryFailure: function (payload) {
        var key = this._key(payload.userId, payload.token);

        this.statuses[key].expired = true; // TODO: handle other cases

        this.emitChange();
    },
    handleResetPassword: function (payload) {
        var key = this._key(payload.userId, payload.token);

        this.statuses[key].sending = true;

        this.emitChange();
    },
    handleResetPasswordSuccess: function (payload) {
        var key = this._key(payload.userId, payload.token);

        this.statuses[key].sending = false;
        this.statuses[key].success = true;

        this.emitChange();
    },
    handleResetPasswordFailure: function (payload) {
        var key = this._key(payload.userId, payload.token);

        this.statuses[key].sending = false;

        this.emitChange();
    },
    getStatus: function (userId, token) {
        return this._getStatus(userId, token);
    },
    _getStatus: function (userId, token) {
        if (!this.statuses[this._key(userId, token)]) {
            this._resetStatus(userId, token);
        }

        return this.statuses[this._key(userId, token)];
    },
    _resetStatus: function (userId, token) {
        this.statuses[this._key(userId, token)] = {
            started : false,
            expired : false,
            sending : false,
            success : false,
            user    : null
        };

        this.dispatcher.getContext().executeAction(AuthActions.StartPasswordRecovery, {
            userId  : userId,
            token   : token
        });
    },
    _key: function (userId, token) {
        return userId+'-'+token;
    }
});
