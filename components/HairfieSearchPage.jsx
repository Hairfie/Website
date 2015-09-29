'use strict';

var React = require('react');
var _ = require('lodash');
var Search = require('./Search');
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairfieActions = require('../actions/HairfieActions');

var HairfieSearchPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        var query = {};
        query.tags = this.props.search.tags || [];
        query.categories = _.map(this.props.categories, 'slug') || [];

        return <Search.Layout
            query={query}
            search={this.props.search}
            tab="hairfie"
            address={this.props.address}
            place={this.props.place}
            filters={this.renderFilters()}
            results={this.renderResults()} />;
    },
    renderFilters: function () {
        var result = _.keys((this.props.result || {}).tags);
        var tags = this.props.tags;

        return <Search.Filters
            search={this.props.search}
            tags={tags}
            tagCategories={this.props.tagCategories}
            onChange={this.handleSearchChange} />;
    },
    renderResults: function () {
        return <Search.HairfieResult search={this.props.search} result={this.props.result} />;
    },
    handleSearchChange: function (nextSearch) {
        var search = _.assign({}, this.props.search, nextSearch, { page: 1 });
        this.context.executeAction(HairfieActions.submitSearch, search);
    }
});

HairfieSearchPage = connectToStores(HairfieSearchPage, [
    'PlaceStore',
    'HairfieStore',
    'CategoryStore',
    'TagStore'
], function (context, props) {
    var address = SearchUtils.addressFromUrlParameter(props.route.params.address);
    var place = context.getStore('PlaceStore').getByAddress(address);
    var search = {};
    var result;

    if (place) {
        search = SearchUtils.searchFromRouteAndPlace(props.route, place);
        result = context.getStore('HairfieStore').getSearchResult(search);
    }

    var tags = result ? context.getStore('TagStore').getTagsByName(_.keys(result.tags)) : '';

    var searchTagsId;
    if (search && !(_.isEmpty(tags))) {
        searchTagsId = _.map(search.tags, function(tag) {
            var foundTag = _.find(tags, {'name': tag});
            return foundTag && foundTag.id;
        });
    }

    return {
        address: address,
        place: place,
        search: search,
        result: result,
        tagCategories: context.getStore('TagStore').getTagCategories(),
        tags: tags,
        categories: context.getStore('CategoryStore').getCategoriesByTagsId(searchTagsId)
    };
});

module.exports = HairfieSearchPage;
