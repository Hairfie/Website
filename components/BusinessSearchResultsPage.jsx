/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var PlaceStore = require('../stores/PlaceStore');
var RouteStore = require('../stores/RouteStore');
var BusinessSearchStore = require('../stores/BusinessSearchStore');
var BusinessActions = require('../actions/Business');
var NavLink = require('flux-router-component').NavLink;
var SearchUtils = require('../lib/search-utils');

var Layout = require('./PublicLayout.jsx');
var Search = require('./Search');

var _ = require('lodash');

var Pagination = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        onChange: _.noop
    },
    render: function () {
        return (
            <nav>
                <ul className="pagination">
                    {_.map(this._buildListItems(), function (item, i) {
                        return (
                            <li key={item.label+'-'+i} className={item.active && 'disabled'}>
                                <a href="#" onClick={this.handleClick.bind(this, item)}>
                                    {item.label}
                                </a>
                            </li>
                        );
                    }, this)}
                </ul>
            </nav>
        );
    },
    handleClick: function (item, e) {
        e.preventDefault();
        if (item.page) this.props.onChange(item.page);
    },
    _buildListItems: function () {
        var items = [];
        for (var i = 1; i <= this.props.numPages; i++) {
            items.push({
                label   : i,
                page    : i,
                active  : this.props.page == i
            });
        }

        return items;
    }
});

var Breadcrumb = React.createClass({
    render: function () {
        var crumbs = [];
        var place  = this.props.place;

        while (place) {
            crumbs.unshift({
                last: crumbs.length == 0,
                label: place.name.split(',')[0],
                routeName: 'business_search_results',
                navParams: {
                    address: SearchUtils.addressToUrlParameter(place.name)
                }
            });
            place = place.parent;
        }

        return (
            <div className="col-xs-12 hidden-xs hidden-sm">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb, i) {
                        if (crumb.last) {
                            return (
                                <li key={i+'-'+crumb.label} className="active">
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li key={i+'-'+crumb.label}>
                                    <NavLink context={this.props.context} routeName={crumb.routeName} navParams={crumb.navParams}>
                                        {crumb.label}
                                    </NavLink>
                                </li>
                            );
                        }
                    }, this)}
                </ol>
            </div>
        );
    }
});

var SearchResults = React.createClass({
    render: function () {
        var result = this.props.result || {},
            date   = this.props.search && this.props.search.date;

        return (
            <div className="row">
                {_.map(result.hits, function (business) {
                    return <Search.BusinessResult key={business.id} context={this.props.context} business={business} date={date} />
                }, this)}
            </div>
        );
    }
});

var SearchFilters = React.createClass({
    render: function () {
        var className;
        if(this.props.mobile) {
            className = "sidebar col-xs-12";
        } else {
            className = "sidebar col-md-4 col-sm-12 hidden-xs hidden-sm";
        }
        return (
            <div className={className}>
                {this.renderCurrentFilters()}
                <h1>Affiner la recherche</h1>
                <section>
                    <form>
                    {this.renderRadius()}
                    {this.renderPrice()}
                    {this.renderQuery()}
                    {this.renderCategories()}
                    </form>
                </section>
            </div>
        );
    },
    renderCurrentFilters: function () {
        var filters = _.flatten([
            _.map(this.props.search.categories, function (value) {
                return {type: "categories", value: value};
            })
        ]);

        if (filters.length == 0) return;

        return (
            <section className="filter-recap">
                <h2>Ma sélection</h2>
                {_.map(filters, function (filter) {
                    return (
                        <label key={filter.type+'|'+filter.value} className="checkbox-inline">
                            <input type="checkbox" align="baseline" checked onChange={this.removeFilter.bind(this, filter)} className="checkbox-disabled" />
                            <span></span>
                            {filter.value}
                        </label>
                    );
                }, this)}
            </section>
        );
    },
    renderRadius: function () {
        if (!this.props.search.location) return;

        return <Search.RadiusFilter min={1000} max={50000} defaultValue={this.props.search.radius} onChange={this.handleRadiusChange} />
    },
    renderPrice: function () {
        var min   = 0,
            max   = 1000,
            price = _.assign({min: min, max: max}, this.props.search.price);

        return <Search.PriceFilter defaultValue={price} min={min} max={max} onChange={this.handlePriceChange} />
    },
    renderQuery: function () {
        return (
            <div>
                <h2>Qui ?</h2>
                <div className="input-group">
                    <div className="input-group-addon"></div>
                    <input className="form-control" ref="query" type="text" defaultValue={this.props.search.query} onChange={this.handleQueryChange} />
                    <div className="input-group-addon"><a href="#"></a></div>
                </div>
            </div>
        );
    },
    renderCategories: function () {
        var facets = this.props.result && this.props.result.facets || {};

        var categories = _.keys(facets.categories);

        if (categories.length == 0) return;

        return (
            <div>
                <h2>Catégories</h2>
                {_.map(categories, function (category) {
                    var filter   = {type: 'categories', value: category};
                    var active   = this.props.search && (this.props.search.categories || []).indexOf(category) > -1;
                    var onChange = active ? this.removeFilter.bind(this, filter) : this.addFilter.bind(this, filter);

                    return (
                        <label key={category} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                            <span />
                            {category}
                        </label>
                    );
                }, this)}
            </div>
        );
    },
    addFilter: function (filter) {
        switch (filter.type) {
            case 'categories':
                var categories = _.union(this.props.search.categories || [], [filter.value]);
                this.props.onChange({categories: categories});
                break;
        }
    },
    removeFilter: function (filter) {
        switch (filter.type) {
            case 'price':
                this.props.onChange({price: undefined});
                break;
            case 'categories':
                var categories = _.without(this.props.search.categories, filter.value);
                this.props.onChange({categories: categories});
                break;
        }
    },
    handleQueryChange: _.debounce(function () {
        this.props.onChange({query: this.refs.query.getDOMNode().value});
    }, 500),
    handleRadiusChange: function (nextRadius) {
        this.props.onChange({radius: nextRadius});
    },
    handlePriceChange: function (nextPrice) {
        this.props.onChange({price: nextPrice});
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [PlaceStore, BusinessSearchStore]
    },
    getStateFromStores: function (props) {
        var props   = props || this.props;
        var address = SearchUtils.addressFromUrlParameter(props.route.params.address);
        var place   = this.getStore(PlaceStore).getByAddress(address);
        var search  = {};
        var result  = {};

        if (place) {
            search = SearchUtils.searchFromRouteAndPlace(props.route, place);
            result = this.getStore(BusinessSearchStore).getResult(search);
        }

        return {
            place   : place,
            search  : search,
            result  : result
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    componentDidMount: function() {
        $('body').on("click",'.trigger-filters',function(){
            if( jQuery('.mobile-filtres').css('top') != '85px' ) {
                TweenMax.to('.mobile-filtres', 0.4, {top:85,ease:Power2.easeInOut,onComplete:function(){
                    jQuery('body').toggleClass('locked');
                    jQuery('.mobile-filtres').addClass('opened');
                    jQuery('.trigger-filters').html('Enregistrer les filtres');
                }});
            } else if (jQuery('.mobile-filtres').hasClass('opened') ) {
                TweenMax.to('.mobile-filtres', 0.4, {top:'100%',ease:Power2.easeOut,onComplete:function(){
                    jQuery('body').toggleClass('locked');
                    jQuery('.mobile-filtres').removeClass('opened');
                    jQuery('.trigger-filters').html('Filtrer');
                }});
            }
        });
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        var place = this.state.place || {};

        return (
            <Layout context={this.props.context} withSearchBar={true}>
                <div className="mobile-screen hidden-md hidden-lg">
                    <a href="#" className="btn-red trigger-filters btn-mobile-fixed">Filtres</a>
                </div>
                <div className="container search" id="content">
                    <div className="mobile-search visible-sm visible-xs">
                        <div className="mobile-filtres">
                            <SearchFilters context={this.props.context} search={this.state.search} result={this.state.result} onChange={this.handleSearchChange} mobile={true} />
                        </div>
                    </div>
                    <div className="row">
                        <Breadcrumb context={this.props.context} place={this.state.place} />
                        <SearchFilters context={this.props.context} search={this.state.search} result={this.state.result} onChange={this.handleSearchChange} />
                        <div className="main-content col-md-8 col-sm-12">
                            <section className="search-content">
                                {this.renderHeader()}
                                <div className="row">
                                    <div role="tabpanel" className="col-xs-12">
                                        <div className="tab-content">
                                            <div role="tabpanel" className="tab-pane fade active in" id="salons">
                                                <SearchResults context={this.props.context} search={this.state.search} result={this.state.result} />
                                                <Pagination onChange={this.handlePageChange} page={this.state.search.page} numPages={this.state.result && this.state.result.nbPages} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                {/* the following container is mandatory, but I don't know why!? */}
                <div className="container">
                    <div className="row" />
                </div>
            </Layout>
        );
    },
    renderHeader: function () {
        var place = this.state.place || {};

        var coverImage;
        if (place.picture) {
            coverImage = <img src={place.picture.url} alt={place.name} className="cover" />;
        }

        return (
            <div className="row">
                <div className="col-xs-12 header-part">
                    {coverImage}
                    <h3>{(place.name || '').split(',')[0]}</h3>
                    <p>{place.description}</p>
                </div>
            </div>
        );
    },
    handleSearchChange: function (nextSearch) {
        var search = _.assign(this.state.search, nextSearch, {page: 1});
        this.props.context.executeAction(BusinessActions.SubmitSearch, {search: search});
    },
    handlePageChange: function (nextPage) {
        var search = _.assign(this.state.search, {page: nextPage});
        this.props.context.executeAction(BusinessActions.SubmitSearch, {search: search});
    }
});
