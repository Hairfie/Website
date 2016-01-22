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
  				<Input type="text" ref="firstName" onChange={formValidation.required} onFocus={formValidation.required} onKeyPress={this.handleKey} placeholder="Prénom *" defaultValue={this.props.firstName || ""} />
  				<p>* Nom : </p>
          <Input type="text" ref="lastName" onChange={formValidation.required} onFocus={formValidation.required} onKeyPress={this.handleKey} placeholder="Nom *" defaultValue={this.props.lastName || ""}/>
  				<p>* Adresse mail : </p>
          <Input type="email" ref="email" onChange={formValidation.email} onFocus={formValidation.email} onKeyPress={this.handleKey} placeholder="Adresse Email *" defaultValue={this.props.email || ""} />
  				<p>* Mot de passe : </p>
          <Input type="password" ref="password"  onChange={formValidation.password} onFocus={formValidation.password} onKeyPress={this.handleKey} placeholder="Mot de Passe *" />
  				<p>Téléphone : </p>
          <Input type="text" ref="phoneNumber" onChange={formValidation.phoneNumber} onFocus={formValidation.phoneNumber} onKeyPress={this.handleKey} placeholder="Numéro de portable (Facultatif)" defaultValue={this.props.phoneNumber || ""} />
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
            <input type="text" ref="firstName" onChange={formValidation.required} onFocus={formValidation.required} onKeyPress={this.handleKey} defaultValue={this.props.firstName || ""} />
          </div>
        </div>
        <div className="mobile-input">
          <p>Nom*</p>
          <div className="form-group">
            <input type="text" ref="lastName" onChange={formValidation.required} onFocus={formValidation.required} onKeyPress={this.handleKey} defaultValue={this.props.lastName || ""}/>
          </div>
        </div>
        <div className="mobile-input">
          <p>Adresse mail*</p>
          <div className="form-group">
            <input type="email" ref="email" onChange={formValidation.email} onFocus={formValidation.email} onKeyPress={this.handleKey} defaultValue={this.props.email || ""} />
          </div>
        </div>
        <div className="mobile-input">
          <p>Mot de passe*</p>
          <div className="form-group">
            <input type="password" ref="password"  onChange={formValidation.password} onFocus={formValidation.password} onKeyPress={this.handleKey} />
          </div>
        </div>
        <div className="mobile-input">
          <p>Téléphone</p>
          <div className="form-group">
            <input type="text" ref="phoneNumber" onChange={formValidation.phoneNumber} onFocus={formValidation.phoneNumber} onKeyPress={this.handleKey} defaultValue={this.props.phoneNumber || ""} />
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
	handleGenderChanged: function (e) {
    console.log(e.currentTarget.value);
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
			withNavigate: this.props.withNavigate
		};
		this.context.executeAction(AuthActions.register, userInfo);
	}
});