'use strict';

var React = require('react');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var NavigationActions = require('../../actions/NavigationActions');
var Input = require('react-bootstrap').Input;
var Link = require('../Link.jsx');
var formValidation = require('../../lib/formValidation');

module.exports = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
        return {
          email: this.props.email
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
            <p>* Adresse mail :</p>
            <Input type="email" ref="email" onKeyPress={this.handleKey} placeholder="Adresse Email *" onFocus={formValidation.email} onChange={this.handleEmailChange} value={this.state.email} />
            <p>* Mot de passe :</p>
            <Input type="password" ref="password" onKeyPress={this.handleKey} placeholder="Mot de Passe *" onFocus={formValidation.password} onChange={this.handlePasswordChange} value={this.state.password} />
            <a role="button" onClick={this.submit} className="btn btn-red full">Se connecter</a>
            <a role="button" onClick={this.resetPassword} className="forgot-password">Mot de passe oublié ?</a>
        </form>
		);
	},
    renderMobile: function() {
        return (
        <form className="form visible-xs">
            <div className="mobile-input">
                <p>* Adresse mail :</p>
                <div className="form-group">
                    <input type="email" onKeyPress={this.handleKey} placeholder="Adresse Email *" onFocus={formValidation.email} onChange={this.handleEmailChange} value={this.state.email} />
                </div>
            </div>
            <div className="mobile-input">
                <p>* Mot de passe :</p>
                <div className="form-group">
                    <input type="password" onKeyPress={this.handleKey} placeholder="Mot de Passe *" onFocus={formValidation.password} onChange={this.handlePasswordChange} value={this.state.password} />
                </div>
            </div>
            <a role="button" onClick={this.submit} className="btn btn-red full">Se connecter</a>
            <a role="button" onClick={this.resetPassword} className="forgot-password">Mot de passe oublié ?</a>
        </form>
        );
    },
    handleKey: function(e) {
        if(event.keyCode == 13) {
            e.preventDefault();
            this.submit();
        }
    },
    handleEmailChange: function (e) {
        formValidation.email(e);
        this.setState({
            email: e.currentTarget.value
        });
    },
    handlePasswordChange: function (e) {
        formValidation.password(e);
        this.setState({
            password: e.currentTarget.value
        });
    },
    resetPassword: function(e) {
        e.preventDefault();
        return this.context.executeAction(NavigationActions.navigate, {
            route: 'ask_reset_password',
            query: { email: this.refs.email.getValue() }
        });
    },
	submit: function() {
        this.context.executeAction(AuthActions.emailConnect, {
            email: this.state.email,
            password: this.state.password,
            withNavigate: this.props.withNavigate
        });
	}
});