/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var RouterMixin = require('flux-router-component').RouterMixin;
var RouteStore = require('../stores/RouteStore');
var AuthStore = require('../stores/AuthStore');

var NotFoundPage = require('./NotFoundPage.jsx');
var BusinessInfosPage = require('./BusinessInfosPage.jsx');
var Navigate = require('flux-router-component/actions/navigate');
var _ = require('lodash');

var ga = require('../services/analytics');

module.exports = React.createClass({
    mixins: [FluxibleMixin, RouterMixin],
    statics: {
        storeListeners: [RouteStore, AuthStore]
    },
    getStateFromStores: function () {
        return {
            route: this.getStore(RouteStore).getCurrentRoute(),
            isAuthenticated: this.getStore(AuthStore).isAuthenticated()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var route     = this.state.route,
            component = route && route.config && route.config.pageComponent;

        if (!component) return this.renderNotFound();

        // check access is granted
        if (route.config.authRequired && !this.state.isAuthenticated) {
            this.executeAction(Navigate, {
                url: this.props.context.makePath('pro_home')
            });

            return <p>Access denied</p>;
        }

        if (route.config.leaveAfterAuth && this.state.isAuthenticated) {
            this.executeAction(Navigate, {
                url: this.props.context.makePath('pro_dashboard')
            });

            return <p>Redirect in progress</p>;
        }

        ga('send', 'pageview', {
            'page': route.url
        });

        return React.createElement(route.config.pageComponent, {
            context : this.props.context,
            route   : route
        });
    },
    renderNotFound: function () {
        return <NotFoundPage context={this.props.context} />
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
