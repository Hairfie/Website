/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var PlaceStore = require('../stores/PlaceStore');
var BusinessSearchStore = require('../stores/BusinessSearchStore');
var SearchUtils = require('../lib/search-utils');


module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessSearchStore]
    },
    getStateFromStores: function () {
        var state = {};

        // place
        var address = SearchUtils.locationFromUrlParameter(this.props.route.params.location);
        state.place = this.getStore(PlaceStore).getByAddress(address);

        return state;
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var place = this.state.place || {};

        return <h2>Coiffeurs à {place.name}</h2>;
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
