'use strict';

var _ = require('lodash');

var DealActions = require('../Deal');
var HairfieActions = require('../Hairfie');
var CategoryActions = require('../Category');


module.exports = function (context, payload, done) {
    context.executeActions([
        [DealActions.FetchTop, {limit: payload.config.numTopDeals}],
        [HairfieActions.FetchTop, {limit: payload.config.numTopHairfies}],
        [CategoryActions.FetchAll]
    ], done);
};
