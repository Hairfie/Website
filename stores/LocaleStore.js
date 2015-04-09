'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

module.exports = createStore({
    storeName: 'LocaleStore',
    handlers: makeHandlers({
        handleChangeRoute: 'CHANGE_ROUTE_START'
    }),
    dehydrate: function () {
        return {
            locale: this.locale
        };
    },
    rehydrate: function (state) {
        this.locale = state.locale;
    },
    handleChangeRoute: function (route) {
        var locale = route.params.locale;

        if (locale != this.locale) {
            this.locale = locale;
            this.emitChange();
        }
    },
    getLocale: function () {
        return this.locale;
    }
});
