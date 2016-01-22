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
            <Input type="email" ref="email" onKeyPress={this.handleKey} placeholder="Adresse Email *" onFocus={formValidation.email} onChange={formValidation.email} />
            <p>* Mot de passe :</p>
            <Input type="password" ref="password" onKeyPress={this.handleKey} placeholder="Mot de Passe *" onFocus={formValidation.password} onChange={formValidation.password}/>
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
                    <input type="email" ref="email" onKeyPress={this.handleKey} placeholder="Adresse Email *" onFocus={formValidation.email} onChange={formValidation.email} />
                </div>
            </div>
            <div className="mobile-input">
                <p>* Mot de passe :</p>
                <div className="form-group">
                    <input type="password" ref="password" onKeyPress={this.handleKey} placeholder="Mot de Passe *" onFocus={formValidation.password} onChange={formValidation.password}/>
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