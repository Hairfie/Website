'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var UserConstants = require('../../constants/UserConstants');
var NotificationActions = require('../../actions/NotificationActions');
var AuthActions = require('../../actions/AuthActions');
var ImageField = require('../Partial/ImageField.jsx');
var formValidation = require('../../lib/formValidation');

module.exports = React.createClass({
  contextTypes: {
        executeAction: React.PropTypes.func
  },
  getInitialState: function() {
    return {newsletter: true, userGender: this.props.gender || ""};
  },
	render: function() {
		return (
			<form className="form">
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
  				<Input type="text" ref="firstName" onChange={formValidation.required} onFocus={formValidation.required} onKeyPress={this.handleKey} placeholder="Prénom *" defaultValue={this.props.firstName || ""} />
  				<Input type="text" ref="lastName" onChange={formValidation.required} onFocus={formValidation.required} onKeyPress={this.handleKey} placeholder="Nom *" defaultValue={this.props.lastName || ""}/>
  				<Input type="email" ref="email" onChange={formValidation.email} onFocus={formValidation.email} onKeyPress={this.handleKey} placeholder="Adresse Email *" defaultValue={this.props.email || ""} />
  				<Input type="password" ref="password"  onChange={formValidation.password} onFocus={formValidation.password} onKeyPress={this.handleKey} placeholder="Mot de Passe *" />
  				<Input type="text" ref="phoneNumber" onChange={formValidation.phoneNumber} onFocus={formValidation.phoneNumber} onKeyPress={this.handleKey} placeholder="Numéro de portable (Facultatif)" defaultValue={this.props.phoneNumber || ""} />
          <div className="form-group">
            <ImageField ref="picture" container="users" text="(facultatif)"/>
          </div>
  				<label className="register-checkbox">
            <input type="checkbox" name='newsletter' checked={this.state.newsletter === true} onChange={this.handleNewsletterChanged} />
            <span></span>
            Je souhaite recevoir les Newsletters.
          </label>
  			<a role="button" onClick={this.submit} className="btn btn-red full">Se connecter</a>
		</form>
		);
	},
	handleGenderChanged: function (e) {
    this.setState({
      userGender: e.currentTarget.value
    });
  },
  handleKey: function(e) {
    if(event.keyCode == 13){
      e.preventDefault();
      this.submit();
      }
  },
  handleNewsletterChanged: function (e) {
  	this.setState({
  		newsletter: e.currentTarget.checked
  	});
  },
	submit: function(e) {
    e.preventDefault();

		var userInfo = {
			email: this.refs.email.getValue(),
			firstName: this.refs.firstName.getValue(),
			lastName: this.refs.lastName.getValue(),
			password: this.refs.password.getValue(),
			gender: this.state.userGender,
			newsletter: this.state.newsletter,
			phoneNumber: this.refs.phoneNumber.getValue(),
			withNavigate: this.props.withNavigate,
      picture: this.refs.picture.getImage()
		};
		this.context.executeAction(AuthActions.register, userInfo);
	}
});