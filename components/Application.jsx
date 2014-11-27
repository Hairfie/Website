/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var RouterMixin = require('flux-router-component').RouterMixin;
var ApplicationStore = require('../stores/ApplicationStore');
var navigateAction = require('flux-router-component/actions/navigate');
var NavLink = require('flux-router-component').NavLink;

var routes = require('../configs/routes');

var HomePagePro = require('./HomePagePro.jsx');
var HomePage = require('./HomePage.jsx');
var DashboardPage = require('./DashboardPage.jsx');
var BusinessClaimPage = require('./BusinessClaimPage.jsx');
var ShowHairfiePage = require('./ShowHairfiePage.jsx');
var ShowBusinessPage = require('./ShowBusinessPage.jsx');
var NotFoundPage = require('./NotFoundPage.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');


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
        var routeName = this.state.route ? this.state.route.name : null;
        var body = null;
        switch (routeName) {
            case 'home':
                return <HomePage context={this.props.context} />

            case 'pro_home':
                return <HomePagePro context={this.props.context} />

            case 'pro_dashboard':
                return <DashboardPage context={this.props.context} />

            case 'pro_business_claim':
                return <BusinessClaimPage context={this.props.context} />

            case 'show_hairfie':
                return <ShowHairfiePage context={this.props.context} />

            case 'show_business':
                return <ShowBusinessPage context={this.props.context} />

            default:
                console.log(routeName);
                return <NotFoundPage context={this.props.context} />
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
