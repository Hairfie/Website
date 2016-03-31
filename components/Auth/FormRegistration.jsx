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
    return {
      newsletter: true, 
      userGender: this.props.gender || "",
      firstName: this.props.firstName || "",
      lastName: this.props.lastName || "",
      phoneNumber: this.props.phoneNumber || "",
      email: this.props.email || ""
    };
  },
  render: function() {
      return (
          <div>
              {this.renderMobile()}
              {this.renderDesktop()}
          </div>
      );
  },
	renderDesktop: function() {
		return (
			<form className="form hidden-xs">
        <p style={{display: "inline-block"}}>* Vous êtes : </p>
          <div className="form-group" style={{display: "inline-block", marginTop: 0}}>
            <label className="radio-inline">
              <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
              Homme
            </label>
            <label className="radio-inline" style={{marginLeft: '0px'}}>
              <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
              Femme
            </label>
          </div>
          <p>* Prénom : </p>
  				<Input type="text" onChange={this.handleFirstNameChange} onFocus={formValidation.required} onKeyPress={this.handleKey} placeholder="Prénom *" value={this.state.firstName} />
  				<p>* Nom : </p>
          <Input type="text" onChange={this.handleLastNameChange} onFocus={formValidation.required} onKeyPress={this.handleKey} placeholder="Nom *" value={this.state.lastName}/>
  				<p>* Adresse mail : </p>
          <Input type="email" onChange={this.handleEmailChange} onFocus={formValidation.email} onKeyPress={this.handleKey} placeholder="Adresse Email *" value={this.state.email} />
  				<p>* Mot de passe : </p>
          <Input type="password" onChange={this.handlePasswordChange} onFocus={formValidation.password} onKeyPress={this.handleKey} placeholder="Mot de Passe *" value={this.state.password}/>
  				<p>Téléphone : </p>
          <Input type="text" onChange={this.handlePhoneNumberChange} onFocus={formValidation.phoneNumber} onKeyPress={this.handleKey} placeholder="Numéro de portable (Facultatif)" value={this.state.phoneNumber} />
  				<label className="register-checkbox">
            <input type="checkbox" name='newsletter' checked={this.state.newsletter === true} onChange={this.handleNewsletterChanged} />
            <span></span>
            Je souhaite recevoir les Newsletters.
          </label>
  			<a role="button" onClick={this.submit} className="btn btn-red full">M'INSCRIRE</a>
		</form>
		);
	},
  renderMobile: function () {
    return (
      <form className="form visible-xs">
        <div className="mobile-input">
          <p>Civilité*</p>
          <div className="form-group">
            <select ref="gender" defaultValue={this.state.userGender} placeholder="Catégories" className="col-sm-3" onChange={this.handleGenderChanged}>
                <option value="" disable></option>
                <option value={UserConstants.Genders.FEMALE}>Femme</option>
                <option value={UserConstants.Genders.MALE}>Homme</option>
            </select>
          </div>
        </div>
        <div className="mobile-input">
          <p>Prénom*</p>
          <div className="form-group">
            <input type="text" onChange={this.handleFirstNameChange} onFocus={formValidation.required} onKeyPress={this.handleKey} value={this.state.firstName} />
          </div>
        </div>
        <div className="mobile-input">
          <p>Nom*</p>
          <div className="form-group">
            <input type="text" onChange={this.handleLastNameChange} onFocus={formValidation.required} onKeyPress={this.handleKey} value={this.state.lastName}/>
          </div>
        </div>
        <div className="mobile-input">
          <p>Adresse mail*</p>
          <div className="form-group">
            <input type="email" onChange={this.handleEmailChange} onFocus={formValidation.email} onKeyPress={this.handleKey} value={this.state.email} />
          </div>
        </div>
        <div className="mobile-input">
          <p>Mot de passe*</p>
          <div className="form-group">
            <input type="password" onChange={this.handlePasswordChange} onFocus={formValidation.password} onKeyPress={this.handleKey} value={this.state.password}/>
          </div>
        </div>
        <div className="mobile-input">
          <p>Téléphone</p>
          <div className="form-group">
            <input type="text" onChange={this.handlePhoneNumberChange} onFocus={formValidation.phoneNumber} onKeyPress={this.handleKey} value={this.state.phoneNumber} />
          </div>
        </div>
        <label className="register-checkbox">
          <input type="checkbox" name='newsletter' checked={this.state.newsletter === true} onChange={this.handleNewsletterChanged} />
          <span></span>
          Je souhaite recevoir les Newsletters.
        </label>
      <a role="button" onClick={this.submit} className="btn btn-red full">M'INSCRIRE</a>
    </form>
    );
  },
  handleEmailChange: function (e) {
    formValidation.email(e);
    this.setState({
        email: e.currentTarget.value
    });
  },
  handleFirstNameChange: function (e) {
    formValidation.required(e);
    this.setState({
        firstName: e.currentTarget.value
    });
  },
  handleLastNameChange: function (e) {
    formValidation.required(e);
    this.setState({
        lastName: e.currentTarget.value
    });
  },
  handlePasswordChange: function (e) {
    formValidation.password(e);
    this.setState({
        password: e.currentTarget.value
    });
  },
  handlePhoneNumberChange: function (e) {
    formValidation.phoneNumber(e);
    this.setState({
        phoneNumber: e.currentTarget.value
    });
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
			email: this.state.email,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			password: this.state.password,
			gender: this.state.userGender,
			newsletter: this.state.newsletter,
			phoneNumber: this.state.phoneNumber,
			withNavigate: this.props.withNavigate
		};
		this.context.executeAction(AuthActions.register, userInfo);
	}
});