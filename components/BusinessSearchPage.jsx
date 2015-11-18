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

        var categories = _.compact(_.map(categories, function(cat) {
            return _.find(this.props.categories, {slug: cat});
        }.bind(this)));

        return <Search.Filters
            address={this.props.address}
            place={this.props.place}
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

    var cat = context.getStore('CategoryStore').getCategoriesBySlug(_.values(search.categories));

    var searchTagsId = [];
    if (search && !(_.isEmpty(cat))) {
        _.map(search.categories, function(category) {
            var find = _.find(cat, {'slug': category});
            find = find ? find.tags : undefined;
            searchTagsId = _.union(searchTagsId, find);
        });
    }

    return {
        address: address,
        place: place,
        search: search,
        result: result,
        categories: context.getStore('CategoryStore').getAllCategories(),
        tags: context.getStore('TagStore').getTagsById(searchTagsId)
    };
});

module.exports = BusinessSearchPage;
