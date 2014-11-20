/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var ApplicationStore = require('../stores/ApplicationStore');
var navigateAction = require('flux-router-component/actions/navigate');

var routes = require('../configs/routes');

var UserStatus = require('./UserStatus.jsx');
var HomePage = require('./HomePage.jsx');
var NotFoundPage = require('./NotFoundPage.jsx');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [ApplicationStore]
    },
    getStateFromStores: function () {
        return {
            page: this.getStore(ApplicationStore).getCurrentPage()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var body = null;
        switch (this.state.page) {
            case 'home':
                body = <HomePage context={this.props.context} />
                break;

            default:
                body = <NotFoundPage />
        }

        return (
            <div>
                <UserStatus context={this.props.context} />
                <h1>Hello World</h1>
                {body}
            </div>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
