'use strict';

var React = require('react');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');

var ConnectPage = React.createClass({
	render: function() {
		return (
			<PublicLayout>
				<div className="connect-form">
					<h2>Connexion</h2>
					<div className="connect-button">
						<div className="facebook" />
						<div className="twitter" />
					</div>
					<h4>ou par adresse email</h4>
					<span className="separator"/>
					<form className="form">
						<Input type="email" placeholder="Adresse Email *"/>
						<Input type="password" placeholder="Mot de Passe *" />
						<a href="#" onClick={this.submit} className="btn btn-red full">Se connecter</a>
					</form>
				</div>
			</PublicLayout>
			);
	}
});

module.exports = ConnectPage;