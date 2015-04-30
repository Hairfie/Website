'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var metaGenerator = require('../lib/metaGenerator.js');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'MetaStore',
    handlers: makeHandlers({
        handleChangeRouteSuccess: 'CHANGE_ROUTE_SUCCESS'
    }),
    initialize: function () {
        this.metas = [];
    },
    handleChangeRouteSuccess: function (payload) {
        switch (payload.name) {
            case 'business':
            case 'business_booking':
                this._setupBusinessMetas(payload.params.businessId);
                break;

            case 'hairfie':
                this._setupHairfieMetas(payload.params.hairfieId);
                break;

            default:
                this._setupDefaultMetas();
        }
    },
    getTitle: function () {
        var meta = _.find(this.metas, {property: 'og:title'});

        return meta && meta.content;
    },
    getMetas: function() {
        return this.metas;
    },
    _setupDefaultMetas: function () {
        this.metas = metaGenerator.getBasicMetadata();
        this.emitChange();
    },
    _setupBusinessMetas: function (businessId) {
        var business = this.dispatcher.getStore('BusinessStore').getById(businessId);
        this.metas = metaGenerator.getBusinessMetadata(business);
        this.emitChange();
    },
    _setupHairfieMetas: function (hairfieId) {
        var hairfie = this.dispatcher.getStore('HairfieStore').getById(hairfieId);
        this.metas = metaGenerator.getHairfieMetadata(hairfie);
        this.emitChange();
    }
});
