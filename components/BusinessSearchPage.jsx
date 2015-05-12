'use strict';

var React = require('react');
var _ = require('lodash');
var BusinessActions = require('../actions/BusinessActions');
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('../lib/connectToStores');

var Search = require('./Search');

var BusinessSearchPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        return <Search.Layout
            tab="business"
            address={this.props.address}
            place={this.props.place}
            filters={this.renderFilters()}
            results={this.renderResults()} />;
    },
    renderFilters: function () {
        var facets = this.props.result && this.props.result.facets || {};
        var categories = _.keys(facets.categories);

        return <Search.Filters
            address={this.props.address}
            search={this.props.search}
            categories={categories}
            withQ={true}
            onChange={this.handleSearchChange} />;
    },
    renderResults: function () {
        return <Search.BusinessResult search={this.props.search} result={this.props.result} />;
    },
    handleSearchChange: function (nextSearch) {
        var search = _.assign({}, this.props.search, nextSearch, { page: 1 });
        this.context.executeAction(BusinessActions.submitSearch, search);
    }
});

BusinessSearchPage = connectToStores(BusinessSearchPage, [
    'PlaceStore',
    'HairfieStore',
    'BusinessStore'
], function (stores, props) {
    var address = SearchUtils.addressFromUrlParameter(props.route.params.address);
    var place = stores.PlaceStore.getByAddress(address);
    var search = {};
    var result;

    if (place) {
        search = SearchUtils.searchFromRouteAndPlace(props.route, place);
        result = stores.BusinessStore.getSearchResult(search);
    }

    if (result) { // add top hairfies to each business
        result = _.assign({}, result, { hits: _.map(result.hits, function (hit) {
            return _.assign({}, hit, { topHairfies: stores.HairfieStore.getBusinessTop(hit.id) });
        })});
    }

    return {
        address: address,
        place: place,
        search: search,
        result: result
    };
});

module.exports = BusinessSearchPage;
