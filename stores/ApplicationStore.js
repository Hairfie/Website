'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var AuthStore = require('./AuthStore');
var AuthEvents = require('../constants/AuthConstants').Events;
var debug = require('debug')('App:ApplicationStore');

var routes = require('../configs/routes');

var ROUTE_LOGIN = 'pro_home';
var ROUTE_AFTER_LOGIN = 'pro_business';
var ROUTE_AFTER_LOGIN_FALLBACK = 'pro_dashboard';


module.exports = createStore({
    storeName: 'ApplicationStore',
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
            isAuthenticated     = !!this.dispatcher.getStore(AuthStore).getUser(),
            managedBusinesses   = this.dispatcher.getStore(AuthStore).getManagedBusinesses();

        if (isAuthenticated && currentRoute && currentRoute.config.leaveAfterAuth) {
            debug('user is authenticated, redirecting user to after login page');
            console.log("managedBusinesses", managedBusinesses);
            if(managedBusinesses.length > 0) {
                this.redirectToRoute(ROUTE_AFTER_LOGIN, {id: managedBusinesses[0].id})
            } else {
                this.redirectToRoute(ROUTE_AFTER_LOGIN_FALLBACK);
            }
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
        this.currentRouteName = routeName;
        this.currentPath = routes[routeName].path;
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
