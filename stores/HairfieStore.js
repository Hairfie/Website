'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var HairfieEvents = require('../constants/HairfieConstants').Events;
var HairfieActions = require('../actions/Hairfie');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: makeHandlers({
        handleReceive       : HairfieEvents.RECEIVE,
        handleReceiveSuccess: HairfieEvents.RECEIVE_SUCCESS,
        handleReceiveFailure: HairfieEvents.RECEIVE_FAILURE
    }),
    initialize: function () {
        this.hairfies = {};
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies
        };
    },
    rehydrate: function (state) {
        this.hairfies = state.hairfies;
    },
    handleReceive: function (payload) {
        this.hairfies[payload.id] = _.assign({}, this.hairfies[payload.id], {
            loading: true
        });
        this.emitChange();
    },
    handleReceiveSuccess: function (payload) {
        var hairfie = payload.hairfie;
        if (hairfie) hairfie.descriptions = this._generateDescriptions(hairfie);

        this.hairfies[payload.id] = _.assign({}, this.hairfies[payload.id], {
            entity  : hairfie,
            loading : false
        });

        this.emitChange();
    },
    handleReceiveFailure: function (payload) {
        this.hairfies[payload.id] = _.assign({}, this.hairfies[payload.id], {
            loading: false
        });

        this.emitChange();
    },
    getById: function (hairfieId) {
        var hairfie = this.hairfies[hairfieId];

        if (_.isUndefined(hairfie)) {
            this._fetchById(hairfieId);
        }

        return hairfie && hairfie.entity;
    },
    _fetchById: function (hairfieId) {
        this.hairfies[hairfieId] = _.assign({}, this.hairfies[hairfieId], {loading: true });
        this.dispatcher.getContext().executeAction(HairfieActions.Fetch, {
            id: hairfieId
        });
    },
    // Is this the right place ?
    _generateDescriptions: function(hairfie) {
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
