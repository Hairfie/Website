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
                <li>
                    <a className="dropdown-toggle" href="#">Login in progress...</a>
                </li>
            );
        } else if (this.state.user) {
            var pictureSrc = this.state.user.picture ? this.state.user.picture.url : null;

            return (
                <li className="user-status authenticated">
                    <img src={pictureSrc} />
                    {this.state.user.firstName}
                     - <a onClick={this.logOut}>Log out</a>
                </li>
            );
        } else {
            return (
                <li className="dropdown" id="menuLogin">
                    <a className="dropdown-toggle" href="#" data-toggle="dropdown" id="navLogin">Login</a>
                    <div className="dropdown-menu">
                        <form className="form" id="formLogin">
                            <input type="text" ref="email" placeholder="julia@hairfie.com" />
                            <input type="password" ref="password" placeholder="Password" /><br />
                            <button type="button" id="btnLogin" className="btn" onClick={this.logIn}>Login</button>
                        </form>
                    </div>
                </li>
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
