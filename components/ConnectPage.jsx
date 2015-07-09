'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var AuthActions = require('../actions/AuthActions');
var PublicLayout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');

var ConnectPage = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
	render: function() {
		if (this.props.token.id)
			return this.renderAlreadyConnected();
		return (
			<PublicLayout>
				<div className="connect-form col-sm-4 col-sm-offset-4 col-xs-12">
					<h2>Connexion</h2>
					<div className="connect-button">
						<div className="facebook"><span>Se connecter avec Facebook</span></div>
						<div className="twitter" style={{display: "none"}}><span>Se connecter avec Twitter</span></div>
					</div>
					<h4>ou par adresse email</h4>
					<span className="separator"/>
					<form className="form">
						<Input type="email" ref="email" placeholder="Adresse Email *"/>
						<Input type="password" ref="password" placeholder="Mot de Passe *" />
						<a href="#" onClick={this.submit} className="btn btn-red full">Se connecter</a>
					</form>
				</div>
			</PublicLayout>
			);
	},
	renderAlreadyConnected: function() {
		return (
			<PublicLayout>
				<h2>Il semble que vous soyez déjà connecté</h2>
			</PublicLayout>
			);
	},
	submit: function() {
		var email = this.refs.email.getValue();
		var password = this.refs.password.getValue();
		this.context.executeAction(AuthActions.emailConnect, { email: email, password: password });
		javascript:history.back();
	}
});

ConnectPage = connectToStores(ConnectPage, [
    'AuthStore'
], function (stores, props) {
    return {
        token: stores.AuthStore.getToken()
    };
});

module.exports = ConnectPage;