/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var RouterMixin = require('flux-router-component').RouterMixin;
var RouteStore = require('../stores/RouteStore');
var AuthStore = require('../stores/AuthStore');
var RedirectStore = require('../stores/RedirectStore');

var NotFoundPage = require('./NotFoundPage.jsx');
var BusinessInfosPage = require('./BusinessInfosPage.jsx');
var Navigate = require('flux-router-component/actions/navigate');
var _ = require('lodash');

var provideContext = require('fluxible/addons/provideContext');

var ga = require('../services/analytics');

var Application = React.createClass({
    mixins: [FluxibleMixin, RouterMixin],
    statics: {
        storeListeners: [RouteStore, AuthStore, RedirectStore]
    },
    getStateFromStores: function () {
        return {
            route          : this.getStore(RouteStore).getCurrentRoute(),
            pendingRedirect: this.getStore(RedirectStore).getPending(),
            isAuthenticated: this.getStore(AuthStore).isAuthenticated()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var isRedirect = !!this.state.pendingRedirect;

        if (isRedirect) {
            this.executeAction(Navigate, {
                url: this.state.pendingRedirect.url
            });
        }


        var route     = this.state.route,
            component = route && route.config && route.config.pageComponent;

        if (!component) return this.renderNotFound();

        // check access is granted
        if (route.config.authRequired && !this.state.isAuthenticated) {
            this.props.context.redirect(this.props.context.makePath('pro_home'));

            return <div />;
        }

        if (route.config.leaveAfterAuth && this.state.isAuthenticated) {
            this.props.context.redirect(this.props.context.makePath('pro_dashboard'));

            return <div />;
        }

        if (!isRedirect) {
            ga('send', 'pageview', {
                'page': route.url
            });
        }

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

Application = provideContext(Application);

module.exports = Application;
