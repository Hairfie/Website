'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'DealStore',
    handlers: makeHandlers({
        onReceiveTopDeals: Actions.RECEIVE_TOP_DEALS
    }),
    initialize: function () {
        this.top = [];
    },
    dehydrate: function () {
        return { top: top };
    },
    rehydrate: function (state) {
        this.top = state.top;
    },
    onReceiveTopDeals: function (deals) {
        this.top = deals;
    },
    getTop: function () {
        return this.top;
    }
});
