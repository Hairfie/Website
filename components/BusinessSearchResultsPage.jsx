/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var PlaceStore = require('../stores/PlaceStore');
var RouteStore = require('../stores/RouteStore');
var BusinessSearchStore = require('../stores/BusinessSearchStore');
var SearchUtils = require('../lib/search-utils');
var BusinessActions = require('../actions/Business');
var NavLink = require('flux-router-component').NavLink;

var _ = require('lodash');

var DEFAULT_RADIUS = 1000;

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
        var value = this.props.defaultValue;

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

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessSearchStore]
    },
    getSearchFromProps: function (props) {
        var search = {};
        search.location = SearchUtils.locationFromUrlParameter(props.route.params.location);
        search.radius = Number(props.route.query.radius) || DEFAULT_RADIUS;

        return search;
    },
    getStateFromStores: function (props) {
        var props  = props || this.props;
        var search = this.getSearchFromProps(props);

        return {
            search  : search,
            place   : this.getStore(PlaceStore).getByAddress(search.location)
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
                        <h3>Résultats de la recherche</h3>
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
                location: SearchUtils.locationToUrlParameter(place.name)
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
        var search = _.assign(this.state.search, nextSearch);
        this.props.context.executeAction(BusinessActions.SubmitSearch, search);
    }
});
