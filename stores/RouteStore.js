'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var debug = require('debug')('App:RouteStore');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'RouteStore',
    handlers: {
        CHANGE_ROUTE_SUCCESS: 'handleChangeRoute'
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
            this.currentRoute = _.assign(state.currentRoute, {config: routeConfig});
        }
    },
    handleChangeRoute: function (route) {
        if (this.currentRoute && (this.currentRoute.url === route.url)) {
            return;
        }

        this.currentRoute = route;

        this.emitChange();
    },
    getCurrentRoute: function () {
        return this.currentRoute;
    },
    getParam: function (name) {
        return this.currentRoute && this.currentRoute.params[name];
    }
});
