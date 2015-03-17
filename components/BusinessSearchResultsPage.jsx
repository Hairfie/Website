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
var SearchConfig = require('../configs/search');

var _ = require('lodash');

function noop() {};

var Slider = React.createClass({
    propTypes: {
        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        step: React.PropTypes.number,
        defaultValue: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onChange: noop
        }
    },
    componentDidMount: function () {
        this.$slider = $(this.refs.slider.getDOMNode());
        this.$slider.noUiSlider(this._buildSliderOptions(this.props));
        this.$slider.on('change', this._onChange);
    },
    componentWillUnmount: function () {
        this.$slider.off('change');
    },
    componentWillReceiveProps: function (nextProps) {
        this.$slider.val(nextProps.defaultValue);
    },
    render: function () {
        return <div ref="slider" />;
    },
    getValue: function () {
        return this.$slider.val();
    },
    _buildSliderOptions: function (props) {
        return {
            start: props.defaultValue,
            range: {
                min: props.min,
                max: props.max
            },
            step: props.step
        };
    },
    _onChange: function () {
        this.props.onChange(this.getValue());
    }
});

var FilterBox = React.createClass({
    render: function () {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">{this.props.title}</div>
                <div className="panel-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

var RadiusFilter = React.createClass({
    getDefaultProps: function () {
        return {
            onChange: noop
        };
    },
    render: function () {
        var value = Number(this.props.defaultValue);

        return (
            <FilterBox title="Rayon de la recherche">
                <Slider ref="radius" type="number" onChange={this._onChange} min={1000} max={50000} step={1000} defaultValue={value} />
                Distance de 0 à {value / 1000}km
            </FilterBox>
        );
    },
    getValue: function () {
        return this.refs.radius.getValue();
    },
    _onChange: function () {
        var value = this.getValue();
        this.props.onChange(value);
    }
});

var CategoryFilter = React.createClass({
    getDefaultProps: function () {
        return {
            onChange: noop
        };
    },
    render: function () {
        return (
            <FilterBox title="Catégorie">
                <em>Todo</em>
            </FilterBox>
        );
    }
});


var SearchFilters = React.createClass({
    getDefaultProps: function () {
        return {
            onChange: noop
        };
    },
    render: function () {
        return (
            <div>
                <h3>Affiner la recherche</h3>
                {this.renderRadius()}
                <CategoryFilter onChange={this._onChange} />
            </div>
        );
    },
    renderRadius: function () {
        if (!this.props.place || this.props.place.bounds) {
            return;
        }

        return <RadiusFilter ref="radius" defaultValue={this.props.search.radius} onChange={this._onChange} />;
    },
    _onChange: function () {
        var filters = {};
        if (this.refs.radius) filters.radius = this.refs.radius.getValue();
        this.props.onChange(filters);
    }
});

var SearchResults = React.createClass({
    render: function () {
        var result = this.props.result || {};

        var businessNodes = _.map(result.businesses, function (business) {
            return (
                <li key={business.id}>
                    <NavLink routeName="show_business" navParams={{businessId:business.id, businessSlug:business.slug}}>
                        {business.name}
                    </NavLink>
                </li>
            );
        });

        return (
            <div>
                <h3>{result.nbHits} résultat(s) trouvé(s)</h3>
                <ul>
                    {businessNodes}
                </ul>
            </div>
        );
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [PlaceStore, BusinessSearchStore]
    },
    getStateFromStores: function (props) {
        var props   = props || this.props;
        var address = SearchUtils.locationFromUrlParameter(props.route.params.address);
        var place   = this.getStore(PlaceStore).getByAddress(address);
        var search  = SearchUtils.searchQueryFromRouteAndPlace(props.route, place);

        return {
            address : address,
            place   : place,
            search  : search,
            result  : this.getStore(BusinessSearchStore).getResult(search)
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var place = this.state.place || {};

        return (
            <div className="container">
                <h2>{place.name}</h2>
                {this.renderPlaceBreadcrumb()}
                <div className="row">
                    <div className="col-xs-3">
                        <SearchFilters
                            place={this.state.place}
                            search={this.state.search}
                            onChange={this.handleFilterChange} />
                    </div>
                    <div className="col-xs-9">
                        <SearchResults context={this.props.context} result={this.state.result} />
                    </div>
                </div>
            </div>
        );
    },
    renderPlaceBreadcrumb: function () {
        var places = [];
        var place = this.state.place;
        while (place) {
            places.push(place);
            place = place.parent;
        }
        var places = places.reverse();

        var crumbs = _.map(places, function (place) {
            var navParams = {
                address: SearchUtils.locationToUrlParameter(place.name)
            };

            return (
                <li>
                    <NavLink routeName="business_search_results" navParams={navParams}>
                        {place.name}
                    </NavLink>
                </li>
            );
        });

        return (
            <ol className="breadcrumb">
                {crumbs}
            </ol>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    handleFilterChange: function (nextSearch) {
        var params = _.assign(this.state.search, nextSearch);
        params.address = this.state.address;

        this.props.context.executeAction(BusinessActions.SubmitSearch, params);
    }
});
