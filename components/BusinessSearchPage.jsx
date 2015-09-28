'use strict';

var React = require('react');
var _ = require('lodash');
var BusinessActions = require('../actions/BusinessActions');
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('fluxible-addons-react/connectToStores');

var Search = require('./Search');

var BusinessSearchPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        console.log(this.props);

        var query = {};
        query.tags = _.map(this.props.tags, 'name') || [];
        query.categories = this.props.search.categories;

        return <Search.Layout
            query={query}
            search={this.props.search}
            tab="business"
            address={this.props.address}
            place={this.props.place}
            filters={this.renderFilters()}
            results={this.renderResults()} />;
    },
    renderFilters: function () {
        var facets = this.props.result && this.props.result.facets || {};
        var categories = _.keys(facets.categorySlugs || facets['categorySlugs.fr']);

        debugger;

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
    'BusinessStore',
    'CategoryStore',
    'TagStore'
], function (context, props) {
    var address = SearchUtils.addressFromUrlParameter(props.route.params.address);
    var place = context.getStore('PlaceStore').getByAddress(address);
    var search = {};
    var result;

    if (place) {
        search = SearchUtils.searchFromRouteAndPlace(props.route, place);
        result = context.getStore('BusinessStore').getSearchResult(search);
    }

    if (result) { // add top hairfies to each business
        result = _.assign({}, result, { hits: _.map(result.hits, function (hit) {
            return _.assign({}, hit, { topHairfies: context.getStore('HairfieStore').getBusinessTop(hit.id) });
        })});
    }

    var categories = context.getStore('CategoryStore').getCategoriesByName(_.values(search.categories));

    var searchTagsId = [];
    if (search && !(_.isEmpty(categories))) {
        _.map(search.categories, function(category) {
            searchTagsId = _.union(searchTagsId, _.find(categories, {'name': category}).tags);
        });
    }

    return {
        address: address,
        place: place,
        search: search,
        result: result,
        categories: categories,
        tags: context.getStore('TagStore').getTagsById(searchTagsId)
    };
});

module.exports = BusinessSearchPage;
