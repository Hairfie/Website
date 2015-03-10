'use strict';

var _ = require('lodash');

var DealActions = require('../Deal');
var HairfieActions = require('../Hairfie');
var CategoriesActions = require('../Categories');


module.exports = function (context, payload, done) {
    context.executeActions([
        [DealActions.FetchTop, {limit: payload.config.numTopDeals}],
        [HairfieActions.FetchTop, {limit: payload.config.numTopHairfies}],
        [CategoriesActions.FetchAll]
    ], done);
};
