/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var RouterMixin = require('flux-router-component').RouterMixin;
var ApplicationStore = require('../stores/ApplicationStore');
var navigateAction = require('flux-router-component/actions/navigate');
var NavLink = require('flux-router-component').NavLink;


var routes = require('../configs/routes');

var UserStatus = require('./UserStatus.jsx');
var HomePage = require('./HomePage.jsx');
var DashboardPage = require('./DashboardPage.jsx');
var BusinessClaimPage = require('./BusinessClaimPage.jsx');
var ShowHairfiePage = require('./ShowHairfiePage.jsx');
var ShowBusinessPage = require('./ShowBusinessPage.jsx');
var NotFoundPage = require('./NotFoundPage.jsx');

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
        console.log("routing !");
        switch (routeName) {
            case 'pro_home':
                body = <HomePage context={this.props.context} />
                break;

            case 'pro_dashboard':
                body = <DashboardPage context={this.props.context} />
                break;

            case 'pro_business_claim':
                body = <BusinessClaimPage context={this.props.context} />
                break;

            case 'show_hairfie':
                body = <ShowHairfiePage context={this.props.context} />
                break;

            case 'show_business':
                body = <ShowBusinessPage context={this.props.context} />
                break;

            default:
                console.log(routeName);
                body = <NotFoundPage />
        }

        return (
            <div>
                <NavLink routeName="show_business" navParams={{id: '542535d9c014c8ef1593e966'}} context={this.props.context}>
                    Test link to business
                </NavLink>
                <UserStatus context={this.props.context} />
                {body}
            </div>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
