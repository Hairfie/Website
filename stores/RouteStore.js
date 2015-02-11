'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var AuthStore = require('./AuthStore');
var AuthEvents = require('../constants/AuthConstants').Events;
var debug = require('debug')('App:RouteStore');
var _ = require('lodash');

var navigateAction = require('flux-router-component/actions/navigate');

module.exports = createStore({
    storeName: 'RouteStore',
    handlers: makeHandlers({
        handleChangeRouteSuccess: 'CHANGE_ROUTE_SUCCESS',
        handleAuthChange: [AuthEvents.LOGIN_SUCCESS, AuthEvents.LOGOUT_SUCCESS]
    }),
    initialize: function () {
        this.currentRoute = null;
    },
    dehydrate: function () {
        return {
            currentRoute: _.assign({}, this.currentRoute, {config: undefined})
        };
    },
    rehydrate: function (state) {
        this.currentRoute = null;

        if (state.currentRoute) {
            var routeConfig = this.getContext().getRoutes()[state.currentRoute.name];
            this.currentRoute = _.assign(state.currentRoute, {config: routeConfig});
        }
    },
    handleChangeRouteSuccess: function (route) {
        if (this.currentRoute && (this.currentRoute.url === route.url)) {
            return;
        }

        this.currentRoute = route;

        this.emitChange();

        // should not be the responsability of the auth store
        this.applyAuthRules();
    },
    handleAuthChange: function (payload) {
        this.dispatcher.waitFor([AuthStore], this.applyAuthRules.bind(this, false));
    },
    applyAuthRules: function (alwaysEmitChange) {
        var isAuthenticated = !!this.dispatcher.getStore(AuthStore).getUser();

        if (isAuthenticated && this.currentRoute && this.currentRoute.config.leaveAfterAuth) {
            debug('user is authenticated, redirecting user to after login page');
            this.getContext().executeAction(navigateAction, {
                url: this.getContext().makePath('pro_dashboard')
            }, function () {});
        }

        if (!isAuthenticated && this.currentRoute && this.currentRoute.config.authRequired) {
            debug('user is not authenticated, redirecting user to login page');
            this.getContext().executeAction(navigateAction, {
                url: this.getContext().makePath('pro_home')
            }, function () {});
        }
    },
    navigateTo: function (routeName, params) {
        var url = routes[routeName].path;

        _.forIn(params, function (value, param) {
            url = url.replace(param, value);
        });

        this.currentRouteName = routeName;
        this.currentUrl = url;
        this.currentParams = params || {};
    },
    getCurrentRoute: function () {
        return this.currentRoute;
    },
    getParam: function (name) {
        return this.currentRoute && this.currentRoute.params[name];
    }
});
