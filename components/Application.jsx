/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var RouterMixin = require('flux-router-component').RouterMixin;
var ApplicationStore = require('../stores/ApplicationStore');

var NotFoundPage = require('./NotFoundPage.jsx');

var BusinessInfosPage = require('./BusinessInfosPage.jsx');

module.exports = React.createClass({
    mixins: [StoreMixin, RouterMixin],
    statics: {
        storeListeners: [ApplicationStore]
    },
    getStateFromStores: function () {
        return {
            route: this.getStore(ApplicationStore).getCurrentRoute()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var route = this.state.route;
        if (route && route.config && route.config.pageComponent) {
            return React.createElement(route.config.pageComponent, {
                context : this.props.context,
                route   : route
            });
        } else {
            return <NotFoundPage context={this.props.context} />
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
