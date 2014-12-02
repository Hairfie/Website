'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var HairfieEvents = require('../constants/HairfieConstants').Events;
var _ = require('lodash');

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: makeHandlers({
        'handleOpenSuccess': HairfieEvents.OPEN_SUCCESS,
    }),
    initialize: function () {
        this.hairfie = null;
    },
    handleOpenSuccess: function (payload) {
        this.hairfie = payload.hairfie;
        this.hairfie.descriptions = this.descriptionsGenerator(this.hairfie);
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
    },
    // Is this the right place ?
    descriptionsGenerator: function(hairfie) {
        var descriptions, tags = '', oldDescription = '', businessName = '';
        if(hairfie.tags) {
            tags = _.map(hairfie.tags, function(tag) { return '#'+tag.name.replace(/ /g,''); }).join(" ");
        }
        if(hairfie.description) {
            oldDescription = ' ' + hairfie.description;
        }
        if(hairfie.business) {
            businessName = ' made at ' + hairfie.business.name;
        }
        descriptions = {
            twitter: encodeURIComponent(tags + oldDescription + businessName + ' #hairfie'),
            facebook: tags + oldDescription + businessName,
            display: tags + oldDescription
        };

        return descriptions;
    }
});
