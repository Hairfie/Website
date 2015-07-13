'use strict';

var React = require('react');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var Input = require('react-bootstrap/Input');

module.exports = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
	render: function() {
		return (
        <form className="form">
            <Input type="email" ref="email" placeholder="Adresse Email *"/>
            <Input type="password" ref="password" placeholder="Mot de Passe *" />
            <a href="#" onClick={this.submit} className="btn btn-red full">Se connecter</a>
        </form>
		);
	},
	submit: function() {
        var email = this.refs.email.getValue();
        var password = this.refs.password.getValue();
        this.context.executeAction(AuthActions.emailConnect, { email: email, password: password, withNavigate: this.props.withNavigate });
	}
});