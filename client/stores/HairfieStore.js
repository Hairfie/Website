'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: {
        'RECEIVE_HAIRFIE_SUCCESS': '_receiveHairfie'
    },
    initialize: function () {
        this.hairfie = null;
    },
    _receiveHairfie: function (hairfie) {
        this.hairfie = hairfie;
        this.emitChange();
    },
    getHairfie: function () {
        return this.hairfie;
    },
    dehydrate: function () {
        return {
            hairfie: this.hairfie
        };
    },
    rehydrate: function (state) {
        this.hairfie = state.hairfie;
    }
});