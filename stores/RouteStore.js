'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var AuthStore = require('./AuthStore');
var AuthEvents = require('../constants/AuthConstants').Events;
var debug = require('debug')('App:RouteStore');

var routes = require('../configs/routes');

var _ = require('lodash');

var ROUTE_LOGIN = 'pro_home';
var ROUTE_AFTER_LOGIN = 'pro_dashboard';

module.exports = createStore({
    storeName: 'RouteStore',
    handlers: makeHandlers({
        onChangeRouteSuccess: 'CHANGE_ROUTE_SUCCESS',
        onAuthChange: [
            AuthEvents.LOGIN_SUCCESS,
            AuthEvents.LOGOUT_SUCCESS
        ]
    }),
    dehydrate: function () {
        return {
            currentPath: this.currentPath,
            currentParams: this.currentParams,
            currentRouteName: this.currentRouteName,
        }
    },
    rehydrate: function (state) {
        this.currentPath = state.currentPath;
        this.currentParams = state.currentParams;
        this.currentRouteName = state.currentRouteName;
    },
    onChangeRouteSuccess: function (payload) {
        if (payload.path != this.currentPath) {
            debug('routing from '+this.currentPath+' to '+payload.path);
            this.currentPath = payload.path;
            this.currentParams = payload.params;
            this.currentRouteName = payload.name;
            this.applyAuthRules(true);
        } else {
            debug('no change in path, ignoring route change');
        }
    },
    onAuthChange: function (payload) {
        this.dispatcher.waitFor([AuthStore], this.applyAuthRules.bind(this, false));
    },
    applyAuthRules: function (alwaysEmitChange) {
        var currentRoute        = this.getCurrentRoute(),
            oldRouteName        = this.getCurrentRouteName(),
            isAuthenticated     = !!this.dispatcher.getStore(AuthStore).getUser();

        if (isAuthenticated && currentRoute && currentRoute.config.leaveAfterAuth) {
            debug('user is authenticated, redirecting user to after login page');
            this.redirectToRoute(ROUTE_AFTER_LOGIN);
        }

        if (!isAuthenticated && currentRoute && currentRoute.config.authRequired) {
            debug('user is not authenticated, redirecting user to login page');
            this.redirectToRoute(ROUTE_LOGIN);
        }

        if (alwaysEmitChange || oldRouteName != this.getCurrentRouteName()) {
            this.emitChange();
        }
    },
    redirectToRoute: function (routeName, params) {
        var path = routes[routeName].path;

        _.forIn(params, function (value, param) {
            path = path.replace(param, value);
        });

        this.currentRouteName = routeName;
        this.currentPath = path;
        this.currentParams = params || {};
    },
    getCurrentRoute: function () {
        if (!this.currentRouteName) return;

        return {
            name: this.currentRouteName,
            path: this.currentPath,
            params: this.currentParams,
            config: routes[this.currentRouteName],
            navigate: {
                path: this.currentPath,
            }
        }
    },
    getCurrentRouteName: function () {
        return this.currentRouteName;
    },
    getRouteParam: function (name) {
        return this.currentParams[name];
    }
});
