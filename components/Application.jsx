/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var RouterMixin = require('flux-router-component').RouterMixin;
var RouteStore = require('../stores/RouteStore');
var AuthStore = require('../stores/AuthStore');

var NotFoundPage = require('./NotFoundPage.jsx');
var BusinessInfosPage = require('./BusinessInfosPage.jsx');
var Navigate = require('flux-router-component/actions/navigate');

var ga = require('../services/analytics');

module.exports = React.createClass({
    mixins: [StoreMixin, RouterMixin],
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
        var route = this.state.route;
        if (route && route.config && route.config.pageComponent) {
            console.log(route.config, this.state.isAuthenticated);
            // check access is granted
            if (route.config.authRequired && !this.state.isAuthenticated) {
                this.props.context.executeAction(Navigate, {
                    url: this.props.context.makePath('pro_home')
                });

                return <p>Access denied</p>;
            }

            if (route.config.leaveAfterAuth && this.state.isAuthenticated) {
                this.props.context.executeAction(Navigate, {
                    url: this.props.context.makePath('pro_dashboard')
                });
            }

            ga('send', 'pageview', {
                'page': route.url
            });

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
