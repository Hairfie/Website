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
        return <Search.Layout
            tab="hairfie"
            address={this.props.address}
            place={this.props.place}
            filters={this.renderFilters()}
            results={this.renderResults()} />;
    },
    renderFilters: function () {
        var result = _.keys((this.props.result || {}).tags);
        var tags = _.map(this.props.tags, function (tag) {
            if (this.props.result && this.props.result.tags[tag.name])
                return tag;
        }.bind(this));
        tags = _.compact(tags);

        console.log(tags);
        debugger;
        return <Search.Filters
            search={this.props.search}
            tags={tags}
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

    return {
        address: address,
        place: place,
        search: search,
        result: result,
        categories: context.getStore('CategoryStore').getAllSorted(),
        tags: context.getStore('TagStore').getAllSorted()
    };
});

module.exports = HairfieSearchPage;
