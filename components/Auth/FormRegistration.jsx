'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap/Input');
var UserConstants = require('../../constants/UserConstants');
var NotificationActions = require('../../actions/NotificationActions');
var AuthActions = require('../../actions/AuthActions');

module.exports = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
  getInitialState: function() {
    return {cgu: false, newsletter: false, userGender: ""};
  },
	render: function() {
		return (
			<form className="form">
				<Input type="text" ref="firstName" placeholder="Prénom *"/>
				<Input type="text" ref="lastName" placeholder="Nom *"/>
				<Input type="email" ref="email" placeholder="Adresse Email *"/>
				<Input type="password" ref="password" placeholder="Mot de Passe *" />
				<Input type="text" ref="numberPhone" placeholder="Numéro de portable (Facultatif)" />
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
			phoneNumber: this.refs.phoneNumber.getValue(),
			withNavigate: this.props.withNavigate
		};
		this.context.executeAction(AuthActions.register, userInfo);
	}
});