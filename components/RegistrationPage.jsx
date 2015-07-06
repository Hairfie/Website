'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var AuthActions = require('../actions/AuthActions');
var PublicLayout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');
var UserConstants = require('../constants/UserConstants');
var NotificationActions = require('../actions/NotificationActions');

var RegistrationPage = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
        return {cgu: false, newsletter: false};
    },
	render: function() {
		if (this.props.token.id)
			return this.renderAlreadyConnected();
		return (
			<PublicLayout>
				<div className="connect-form">
					<h2>Inscription</h2>
					<div className="connect-button">
						<div className="facebook"><span>S'inscrire avec Facebook</span></div>
						<div className="twitter" style={{display: "none"}}><span>S'inscrire avec Twitter</span></div>
					</div>
					<h4>ou remplisser ce formulaire</h4>
					<span className="separator"/>
					<form className="form">
						<Input type="text" ref="firstName" placeholder="Prénom *"/>
						<Input type="text" ref="lastName" placeholder="Nom *"/>
						<Input type="email" ref="email" placeholder="Adresse Email *"/>
						<Input type="password" ref="password" placeholder="Mot de Passe *" />
                        <Input className="radio">
                            <label className="radio-inline">
                                <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                	                Homme
                            </label>
                            <label className="radio-inline" style={{marginLeft: '0px'}}>
              	                <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                                    Femme
							</label>
                        </Input>
						<label for="cgu" className="register-checkbox">
                        	<input type="checkbox" name='newsletter' onChange={this.handleNewsletterChanged} />
                        	<span></span>
                        	Je souhaite recevoir les Newsletters.
                    	</label>
						<label for="cgu" className="register-checkbox">
                        	<input type="checkbox" name='cgu' onChange={this.handleCGUChanged} />
                        	<span></span>
                        	Je reconnais avoir prix connaissance des <a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">conditions générales d'{/* ' */}utilisation</a> de hairfie.
                    	</label>
						<a href="#" onClick={this.submit} className="btn btn-red full">Se connecter</a>
					</form>
				</div>
			</PublicLayout>
			);
	},
    handleGenderChanged: function (e) {
        this.setState({
            userGender: e.currentTarget.value
        });
    },
    handleCGUChanged: function (e) {
    	this.setState({
    		cgu: e.currentTarget.checked
    	});
    },
    handleNewsletterChanged: function (e) {
    	this.setState({
    		newsletter: e.currentTarget.checked
    	});
    },
	renderAlreadyConnected: function() {
		return (
			<PublicLayout>
				<h2>Il semble que vous soyez déjà connecté</h2>
			</PublicLayout>
			);
	},
	submit: function() {
		if (!this.state.cgu)
            return this.context.executeAction(
                NotificationActions.notifyFailure,
                "Vous devez accepter les conditions générales d'utilisations pour finaliser l'inscription"
            );
		var userInfo = {
			email: this.refs.email.getValue(),
			firstName: this.refs.firstName.getValue(),
			lastName: this.refs.lastName.getValue(),
			password: this.refs.password.getValue(),
			gender: this.state.userGender,
			newsletter: this.state.newsletter,
		};
		this.context.executeAction(AuthActions.register, userInfo);
	}
});

RegistrationPage = connectToStores(RegistrationPage, [
    'AuthStore'
], function (stores, props) {
    return {
        token: stores.AuthStore.getToken()
    };
});

module.exports = RegistrationPage;