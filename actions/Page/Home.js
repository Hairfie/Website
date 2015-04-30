'use strict';

var _ = require('lodash');

var executeCritical = require('fluxible-action-utils/async/executeCritical');
var DealActions = require('../DealActions');
var HairfieActions = require('../HairfieActions');
var CategoryActions = require('../CategoryActions');


module.exports = function (context, payload, done) {
    return executeCritical(context, {
        categories: {
            action: CategoryActions.loadAll
        },
        topDeals: {
            action: DealActions.loadTopDeals,
            params: { limit: payload.config.numTopDeals }
        },
        topHairfies: {
            action: HairfieActions.loadTopHairfies,
            params: {limit: payload.config.numTopHairfies}
        }
    }, function (err) {
        if (err) {
            err = err.categories || err.topDeals || err.topHairfies;
        }
        done(err);
    });
};
