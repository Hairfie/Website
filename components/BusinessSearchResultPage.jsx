'use strict';

var React = require('react');
var _ = require('lodash');
var SubmitSearch = require('../actions/Business').SubmitSearch;
var NavLink = require('flux-router-component').NavLink;
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('fluxible/addons/connectToStores');

var Search = require('./Search');

var BusinessSearchResultPage = React.createClass({
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
        this.context.executeAction(SubmitSearch, {search: _.assign(this.props.search, nextSearch, {page: 1})});
    }
});

BusinessSearchResultPage = connectToStores(BusinessSearchResultPage, [
    require('../stores/RouteStore'),
    require('../stores/PlaceStore'),
    require('../stores/BusinessSearchStore')
], function (stores, props) {
    var route = stores.RouteStore.getCurrentRoute();
    var address = SearchUtils.addressFromUrlParameter(route.params.address);
    var place = stores.PlaceStore.getByAddress(address);
    var search = {};
    var result;

    if (place) {
        search = SearchUtils.searchFromRouteAndPlace(route, place);
        result = stores.BusinessSearchStore.getResult(search);
    }

    return {
        address: address,
        place: place,
        search: search,
        result: result
    };
});

module.exports = BusinessSearchResultPage;
