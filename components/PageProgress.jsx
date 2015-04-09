/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var RouteStore = require('../stores/RouteStore');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [RouteStore]
    },
    getStateFromStores: function () {
        return {
            loading: this.getStore(RouteStore).isLoading()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        if (!this.isMounted()) return;
        this.setState(this.getStateFromStores());
    },
    render: function () {
        if (!this.state.loading) return <div />;

        var style = {
            display: 'inline-block',
            backgroundColor: '#fc5a5f',
            position: 'fixed',
            zIndex: 100,
            top: 0,
            left: 0,
            width: '100%',
            maxWidth: '100% !important',
            height: '2px',
            boxShadow: '1px 1px 1px rgba(0,0,0,0.4)',
            borderRadius: '0 1px 1px 0',
            WebkitTransition: '.4s width, .4s background-color',
            transition: '.4s width, .4s background-color'
        };

        return <div style={style} />;
    }
});
