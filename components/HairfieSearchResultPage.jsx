'use strict';

var React = require('react');
var _ = require('lodash');
var Search = require('./Search');
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('fluxible/addons/connectToStores');
var SubmitSearch = require('../actions/Hairfie').SubmitSearch;

var HairfieSearchResultPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        return <Search.Layout
            tab="hairfie"
            address={this.props.address}
            place={this.props.place}
            filters={this.renderFilters()}
            results={this.renderResults()} />;
    },
    renderFilters: function () {
        var categories = _.keys((this.props.result || {}).categories);

        return <Search.Filters
            search={this.props.search}
            categories={categories}
            onChange={this.handleSearchChange} />;
    },
    renderResults: function () {
        return <Search.HairfieResult search={this.props.search} result={this.props.result} />;
    },
    handleSearchChange: function (nextSearch) {
        this.context.executeAction(SubmitSearch, {search: _.assign(this.props.search, nextSearch, {page: 1})});
    }
});

HairfieSearchResultPage = connectToStores(HairfieSearchResultPage, [
    'RouteStore',
    'PlaceStore',
    'HairfieSearchStore'
], function (stores, props) {
    var route = stores.RouteStore.getCurrentRoute();
    var address = SearchUtils.addressFromUrlParameter(route.params.address);
    var place = stores.PlaceStore.getByAddress(address);
    var search = {};
    var result;

    if (place) {
        search = SearchUtils.searchFromRouteAndPlace(route, place);
        result = stores.HairfieSearchStore.getResult(search);
    }

    return {
        address: address,
        place: place,
        search: search,
        result: result
    };
});

module.exports = HairfieSearchResultPage;
