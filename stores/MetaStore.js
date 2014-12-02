'use strict';

var createStore = require('fluxible-app/utils/createStore');
var AuthStore = require('./AuthStore');
var debug = require('debug')('App:ApplicationStore');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var HairfieEvents = require('../constants/HairfieConstants').Events;

var makeHandlers = require('../lib/fluxible/makeHandlers');
var metaGenerator = require('../lib/metaGenerator.js');

var _ = require('lodash');

var routes = require('../configs/routes');

module.exports = createStore({
    storeName: 'MetaStore',
    handlers: makeHandlers({
        'getBusinessMetadata': BusinessEvents.OPEN_SUCCESS,
        //'getHairfieMetas': HairfieEvents.OPEN_SUCCESS
    }),
    getCurrentMetadata: function() {
        if (!this.currentMetas) {
            return { metas: metaGenerator.getBasicMetadata() };
        } else {
            return { metas: this.currentMetas };
        }
    },
    getBusinessMetadata: function (payload) {
        this.currentMetas = metaGenerator.getBusinessMetadata(payload.business);
    },
    getHairfieMetadata: function (payload) {
        this.currentMetas = metaGenerator.getHairfieMetadata(payload.hairfie);
    },
    getCurrentTitle: function() {
        console.log("currenttitle", this.getCurrentMetadata().metas);
        return _.find(this.getCurrentMetadata().metas, { property: 'og:title' }).content;
    }
});