'use strict';

function noop() {};

var SearchUtils = require('../../lib/search-utils');

module.exports = function SubmitBusinessSearch(context, payload, done) {
    var done = done || noop;

    var params = SearchUtils.searchToRouteParams(payload.search);

    context.redirect(context.router.makeUrl('business_search_results', params.path, params.query));

    done();
};
