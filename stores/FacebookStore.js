'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var FacebookActions = require('../actions/Facebook');
var FacebookConstants = require('../constants/FacebookConstants');
var FacebookEvents = FacebookConstants.Events;
var LoginStatus = FacebookConstants.LoginStatus;
var Permissions = FacebookConstants.Permissions;
var PagePerms = FacebookConstants.PagePerms;
var PermissionStatus = FacebookConstants.PermissionStatus;
var debug = require('debug')('App:FacebookStore');

module.exports = createStore({
    storeName: 'FacebookStore',
    handlers: makeHandlers({
        handleReceiveLoginStatus: FacebookEvents.RECEIVE_LOGIN_STATUS,
        handleReceivePermissions: FacebookEvents.RECEIVE_PERMISSIONS,
        handleReceiveManagedPages: FacebookEvents.RECEIVE_MANAGED_PAGES
    }),
    handleReceiveLoginStatus: function (payload) {
        debug('Receive login status:', payload.loginStatus);

        var sameToken = accessToken(payload.loginStatus) == accessToken(this.loginStatus);

        if (sameToken && !payload.refreshPermissions) {
            return;
        }

        this.loginStatus = payload.loginStatus;

        if (payload.refreshPermissions) {
            this.permissions = null;
        }

        if (payload.refreshManagedPages) {
            this.managedPages = null;
        }

        this.emitChange();
    },
    handleReceivePermissions: function (payload) {
        debug('Receive permissions:', payload.permissions);
        this.loginStatus = payload.loginStatus;
        var permissions = _.mapValues(_.indexBy(payload.permissions, 'permission'), function (permission) {
            return permission.status == PermissionStatus.GRANTED;
        })

        if (_.isEqual(this.permissions, permissions)) return;

        this.permissions = permissions;
        this.emitChange();
    },
    handleReceiveManagedPages: function (payload) {
        debug('Receive managed pages:', payload.managedPages);

        if (_.isEqual(payload.managedPages, this.managedPages)) return;

        this.managedPages = payload.managedPages;
        this.emitChange();
    },
    _getLoginStatus: function () {
        if (!this.loginStatus) {
            this._refreshLoginStatus();
        }

        return this.loginStatus;
    },
    isConnected: function () {
        var loginStatus = this._getLoginStatus();
        if (!loginStatus) return false;

        return LoginStatus.CONNECTED == loginStatus.status;
    },
    hasPermissions: function (permissions) {
        return _.every(_.map(permissions, this._hasPermission, this));
    },
    getManagedPages: function () {
        if (!this.managedPages) {
            this._refreshManagedPages();
        }

        return this.managedPages || [];
    },
    getPagesWithCreateContentPermission: function () {
        return _.filter(this.getManagedPages(), function (page) {
            return _.contains(page.perms, PagePerms.CREATE_CONTENT);
        });
    },
    _hasPermission: function (permission) {
        if (!this.isConnected()) return false;

        if (!this.permissions) {
            this._refreshPermissions();
            return false;
        }

        return this.permissions[permission];
    },
    _refreshLoginStatus: function () {
        this.dispatcher.getContext().executeAction(FacebookActions.RefreshLoginStatus);
    },
    _refreshPermissions: function () {
        this.dispatcher.getContext().executeAction(FacebookActions.RefreshPermissions);
    },
    _refreshManagedPages: function () {
        this.dispatcher.getContext().executeAction(FacebookActions.RefreshManagedPages);
    }
});

function accessToken(ls) {
    return ls && ls.authResponse && ls.authResponse.accessToken;
}
