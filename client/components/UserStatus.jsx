/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var AuthStore = require('../stores/AuthStore');

var loginAction = require('../actions/login');
var logoutAction = require('../actions/logout');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [AuthStore]
    },
    getStateFromStores: function () {
        return {
            user    : this.getStore(AuthStore).getUser(),
            loading : this.getStore(AuthStore).isLoginInProgress()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        if (this.state.loading) {
            return (
                <div className="user-status loading">
                    Login in progress...
                </div>
            );
        } else if (this.state.user) {
            return (
                <div className="user-status authenticated">
                    <img src={this.state.user.picture.url} />
                    {this.state.user.firstName}
                     - <a onClick={this.logOut}>Log out</a>
                </div>
            );
        } else {
            return (
                <div className="user-status anonymous">
                    <label>Email: <input ref="email" type="email" /></label>
                    <label>Password: <input ref="password" type="password" /></label>
                    <button onClick={this.logIn}>Log in</button>
                </div>
            );
        }
    },
    logOut: function () {
        this.props.context.executeAction(logoutAction);
    },
    logIn: function () {
        this.props.context.executeAction(loginAction, {
            email   : this.refs.email.getDOMNode().value,
            password: this.refs.password.getDOMNode().value
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
