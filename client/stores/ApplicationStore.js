'use strict';

var createStore = require('fluxible-app/utils/createStore');
var AuthStore = require('./AuthStore');
var navigateAction = require('flux-router-component').navigateAction;

var routes = require('../configs/routes');

var ROUTE_LOGIN = 'pro_home';
var ROUTE_AFTER_LOGIN = 'pro_dashboard';

module.exports = createStore({
    storeName: 'ApplicationStore',
    handlers: {
        'CHANGE_ROUTE_SUCCESS': 'onChangeRouteSuccess',
        'RECEIVE_LOGIN_SUCCESS': 'onAuthChange',
        'RECEIVE_LOGOUT_SUCCESS': 'onAuthChange',
    },
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
            this.currentPath = payload.path;
            this.currentParams = payload.params;
            this.currentRouteName = payload.name;
            this.applyAuthRules(true);
        }
    },
    onAuthChange: function (payload) {
        this.dispatcher.waitFor([AuthStore], this.applyAuthRules.bind(this, false));
    },
    applyAuthRules: function (alwaysEmitChange) {
        var currentRoute = this.getCurrentRoute(),
            oldRouteName = this.getCurrentRouteName(),
            isAuthenticated = !!this.dispatcher.getStore(AuthStore).getUser();

        if (isAuthenticated && currentRoute && currentRoute.config.leaveAfterAuth) {
            this.redirectToRoute(ROUTE_AFTER_LOGIN);
        }

        if (!isAuthenticated && currentRoute && currentRoute.config.authRequired) {
            this.redirectToRoute(ROUTE_LOGIN);
        }

        if (alwaysEmitChange || oldRouteName != this.getCurrentRouteName()) {
            this.emitChange();
        }
    },
    redirectToRoute: function (routeName) {
        this.currentRouteName = routeName;
        this.currentPath = routes[routeName].path;
        this.currentParams = {};
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
    }
});
