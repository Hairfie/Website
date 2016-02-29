'use strict';

var React = require('react');
var _ = require('lodash');
var BusinessActions = require('../actions/BusinessActions');
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('fluxible-addons-react/connectToStores');
var TopReviews = require('./Partial/TopReviews.jsx');

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
            categories={this.props.categories}
            tab="business"
            address={this.props.address}
            place={this.props.place}
            filters={this.renderFilters()}
            mobileFilters={this.renderMobileFilters()}
            results={this.renderResults()} 
            topReviews={this.renderTopReviews()}/>;
    },
    renderFilters: function () {
        return <Search.Filters
            tab="business"
            address={this.props.address}
            place={this.props.place}
            search={this.props.search}
            categories={this.props.categories}
            withQ={true}
            onChange={this.handleSearchChange} />;
    },
    renderMobileFilters: function () {
        return <Search.MobileFilters 
            onClose={this.handleDisplayMobileFilters} 
            shouldBeDisplayed={true}
            tab="business"
            allTags = {this.props.allFilters}
            allCategories = {this.props.categories}
            filterCategories = {this.props.filterCategories}
            initialSearch={this.props.search}
            onChange={this.handleSearchChange} />
    },
    renderResults: function () {
        var searchedCategories = _.filter(this.props.categories, function(cat) {
            return _.includes(this.props.search.categories, cat.slug);
        }, this);

        return <Search.BusinessResult search={this.props.search} result={this.props.result} searchedCategories={searchedCategories} onChange={this.handleSearchChange}/>;
    },
    renderTopReviews: function() {
        return <TopReviews />;
    },
    handleDisplayMobileFilters: function() {
        if(this.state.displayMobileFilters == false)
            $('body').toggleClass('locked');
        else
            $('body').removeClass('locked');
        this.setState({displayMobileFilters: (!this.state.displayMobileFilters)});
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
