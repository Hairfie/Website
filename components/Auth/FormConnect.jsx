'use strict';

var React = require('react');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var NavigationActions = require('../../actions/NavigationActions');
var Input = require('react-bootstrap').Input;
var Link = require('../Link.jsx');

module.exports = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
	render: function() {
		return (
        <form className="form">
            <Input type="email" ref="email" placeholder="Adresse Email *"/>
            <Input type="password" ref="password" placeholder="Mot de Passe *" />
            <a role="button" onClick={this.resetPassword} className="green">Mot de passe oublié ?</a>
            <a role="button" onClick={this.submit} className="btn btn-red full">Se connecter</a>
        </form>
		);
	},
    resetPassword: function(e) {
        e.preventDefault();
        return this.context.executeAction(NavigationActions.navigate, {
            route: 'ask_reset_password',
            query: { email: this.refs.email.getValue() }
        });
    },
	submit: function() {
        var email = this.refs.email.getValue();
        var password = this.refs.password.getValue();
        this.context.executeAction(AuthActions.emailConnect, {
            email: email,
            password: password,
            withNavigate: this.props.withNavigate
        });
	}
});