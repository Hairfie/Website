/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var StationStore = require('../../stores/StationStore');
var lodash = require('lodash');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [StationStore]
    },
    getStateFromStores: function () {
        var statio
        return {
            stations    : lodash.groupBy(this.getStore(StationStore).getByBusiness(this.props.business), 'type')
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <div>
                <h4>Transports en commun</h4>
                {this.renderMetroStations()}
                {this.renderRerStations()}
                {this.renderTramStations()}
                {this.renderBusStations()}
            </div>
        )
    },
    renderBusStations: function(busStations) {
        if(this.state.stations && this.state.stations.bus) {
            return (
                <div>
                    Bus : {lodash.uniq(lodash.map(this.state.stations.bus, 'name')).join(', ')}
                </div>
            );
        }
    },
    renderMetroStations: function(metroStations) {
        if(this.state.stations && this.state.stations.metro) {
            return (
                <div>
                    Metro : {lodash.uniq(lodash.map(this.state.stations.metro, 'name')).join(', ')}
                </div>
            );
        }
    },
    renderTramStations: function(metroStations) {
        if(this.state.stations && this.state.stations.tram) {
            return (
                <div>
                    Tram : {lodash.uniq(lodash.map(this.state.stations.tram, 'name')).join(', ')}
                </div>
            );
        }
    },
    renderRerStations: function(metroStations) {
        if(this.state.stations && this.state.stations.rer) {
            return (
                <div>
                    RER : {lodash.uniq(lodash.map(this.state.stations.rer, 'name')).join(', ')}
                </div>
            );
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});