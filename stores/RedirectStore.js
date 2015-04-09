'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var debug = require('debug')('App:RedirectStore');

module.exports = createStore({
    storeName: 'RedirectStore',
    handlers: {
        CHANGE_ROUTE_START: 'handleChangeRoute',
        REDIRECT: 'handleRedirect'
    },
    handleChangeRoute: function (route) {
        debug('Change route detected, removing redirect');
        this.url = null;
        this.emitChange();
    },
    handleRedirect: function (payload) {
        debug('Redirect scheduled');
        this.url = payload.url;
        this.permanent = !!payload.permanent;
        this.emitChange();
    },
    getPending: function () {
        if (!this.url) return;

        return {
            url      : this.url,
            permanent: this.permanent
        };
    }
});
