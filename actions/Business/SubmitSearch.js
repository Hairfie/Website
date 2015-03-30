'use strict';

var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var config = require('../../configs/search');

module.exports = function SubmitBusinessSearch(context, payload, done) {
    var done = done || _.noop;

    var search = _.cloneDeep(payload.search);

    if (!search.address) search.address = config.DEFAULT_ADDRESS;

    var params = SearchUtils.searchToRouteParams(search);

    context.redirect(context.router.makeUrl('business_search_results', params.path, params.query));

    done();
};
