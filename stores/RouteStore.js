'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var debug = require('debug')('App:RouteStore');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'RouteStore',
    handlers: {
        CHANGE_ROUTE_START  : 'handleChangeRoute',
        CHANGE_ROUTE_SUCCESS: 'handleChangeRouteEnd',
        CHANGE_ROUTE_FAILURE: 'handleChangeRouteEnd',
    },
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
            this.currentRoute = _.assign({}, state.currentRoute, {config: routeConfig});
        }
    },
    handleChangeRoute: function (route) {
        if (this.currentRoute && (this.currentRoute.url === route.url)) {
            return;
        }

        this.currentRoute = route;
        this.loading = true;

        this.emitChange();
    },
    handleChangeRouteEnd: function (route) {
        this.loading = false;
        this.emitChange();
    },
    getCurrentRoute: function () {
        return this.currentRoute;
    },
    getPathParam: function (name) {
        return this.currentRoute && this.currentRoute.params[name];
    },
    getQueryParam: function (name) {
        return this.currentRoute && this.currentRoute.query[name];
    },
    isLoading: function () {
        return !!this.loading;
    }
});
