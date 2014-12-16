'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var FacebookActions = require('../actions/Facebook');
var FacebookConstants = require('../constants/FacebookConstants');
var FacebookEvents = FacebookConstants.Events;
var LoginStatus = FacebookConstants.LoginStatus;
var Permissions = FacebookConstants.Permissions;
var PagePerms = FacebookConstants.PagePerms;
var PermissionStatus = FacebookConstants.PermissionStatus;

module.exports = createStore({
    storeName: 'FacebookStore',
    handlers: makeHandlers({
        handleReceiveLoginStatus: FacebookEvents.RECEIVE_LOGIN_STATUS,
        handleReceivePermissions: FacebookEvents.RECEIVE_PERMISSIONS,
        handleReceiveManagedPages: FacebookEvents.RECEIVE_MANAGED_PAGES
    }),
    handleReceiveLoginStatus: function (payload) {
        this.loginStatus = payload.loginStatus;
        this.permissions = null;
        this.managedPages = null;
        this.emitChange();
    },
    handleReceivePermissions: function (payload) {
        this.permissions = _.mapValues(_.indexBy(payload.permissions, 'permission'), function (permission) {
            return permission.status == PermissionStatus.GRANTED;
        })
        this.emitChange();
    },
    handleReceiveManagedPages: function (payload) {
        this.managedPages = payload.managedPages;
        this.emitChange();
    },
    getLoginStatus: function () {
        if (!this.loginStatus) {
            this._refreshLoginStatus();
        }

        return this.loginStatus;
    },
    isConnected: function () {
        var loginStatus = this.getLoginStatus();
        if (!loginStatus) return false;

        return LoginStatus.CONNECTED == loginStatus.status;
    },
    canManagePages: function () {
        return this._hasPermission(Permissions.MANAGE_PAGES);
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
