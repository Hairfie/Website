'use strict';

var React = require('react');
var _ = require('lodash');
var Search = require('./Search');
var SearchUtils = require('../lib/search-utils');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairfieActions = require('../actions/HairfieActions');
var Newsletter = require('./Partial/Newsletter.jsx');

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
            mobileFilters={this.renderMobileFilters()}
            results={this.renderResults()} />
    },
    renderFilters: function () {
        var result = _.keys((this.props.result || {}).tags);
        var tags = this.props.tags;
        return <Search.Filters
            tab="hairfie"
            search={this.props.search}
            tags={tags}
            tagCategories={this.props.tagCategories}
            onChange={this.handleSearchChange} />;

    },
    renderMobileFilters: function () {
        return <Search.MobileFilters 
            onClose={this.handleDisplayMobileFilters} 
            shouldBeDisplayed={true}
            tab="hairfie" 
            allTags = {this.props.tags}
            allCategories = {this.props.categories}
            filterCategories = {this.props.tagCategories}
            initialSearch={this.props.search}
            onChange={this.handleSearchChange} />
    },
    renderResults: function () {
        return <Search.HairfieResult 
            search={this.props.search} 
            result={this.props.result} 
            mixedResult={this.props.mixedResult} 
            searchedCategories={this.props.search.tags}
            loadMore={this.loadMore}
            isFullyLoaded = {this.props.isFullyLoaded}
            onChange={this.handleSearchChange} />;
    },
    handleDisplayMobileFilters: function() {
        if(this.state.displayMobileFilters == false)
            $('body').toggleClass('locked');
        else
            $('body').removeClass('locked');
        this.setState({displayMobileFilters: (!this.state.displayMobileFilters)});
    },
    loadMore: function() {
        this.context.executeAction(HairfieActions.loadSearchResult, _.assign({}, this.props.search, {page: this.props.currentPage + 1 }))
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
    'TagStore',
    'DealStore',
    'BusinessStore'
], function (context, props) {
    var address = SearchUtils.addressFromUrlParameter(props.route.params.address);
    var place = context.getStore('PlaceStore').getByAddress(address);
    var search = {};
    var result, currentPage, isFullyLoaded, tags, i, j, k, mixedResult, businessesToAddToMixedResult;
    j = 0;
    k = 0;
    mixedResult = [];

    if (place) {
        search = SearchUtils.searchFromRouteAndPlace(props.route, place);
        result = context.getStore('HairfieStore').getSearchResult(search);
        currentPage = result && result.currentPage ? result.currentPage : 1;
        isFullyLoaded = result && result.hits.length == result.numHits ? true : false;
    }
    tags = result ? context.getStore('TagStore').getTagsByName(_.keys(result.tags)) : '';

    businessesToAddToMixedResult = context.getStore('BusinessStore').getBusinessesForHairfieSearch();
    if (result) {
        for (i = 0; i < result.hits.length; i++) { 
            mixedResult[j++]= result.hits[i];
            if (i % 14 == 3 || i % 14 == 9){
                mixedResult[j++] = businessesToAddToMixedResult[k % 6];
                k++;
            }
        }
    }

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
        mixedResult: mixedResult,
        currentPage: currentPage,
        isFullyLoaded: isFullyLoaded,
        tagCategories: context.getStore('TagStore').getTagCategories(),
        tags: context.getStore('TagStore').getAllTags(),
        categories: context.getStore('CategoryStore').getCategoriesByTagsId(searchTagsId)
    };
});

module.exports = HairfieSearchPage;
