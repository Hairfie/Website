'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var NavigationActions = require('../../actions/NavigationActions');
var Input = require('react-bootstrap').Input;
var Link = require('../Link.jsx');
// var Joi = require('joi');
var validation = require('react-validation-mixin');
// var strategy = require('joi-validation-strategy');
var strategy = require('react-validatorjs-strategy');
var classNames = require('classnames');

var FormConnect = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
    propTypes: {
        errors: React.PropTypes.object,
        validate: React.PropTypes.func,
        isValid: React.PropTypes.func,
        handleValidation: React.PropTypes.func,
        getValidationMessages: React.PropTypes.func,
        clearValidations: React.PropTypes.func
    },
    getValidatorData() {
        return {
            email: this.state.email,
            password: this.state.password
        };
    },
    getInitialState: function() {
        this.validatorTypes = strategy.createSchema(
            {
                email: 'required|email',
                password: 'required'
            },
            {
                 "required.email": "Email obligatoire",
                 "email.email": "L'email saisi est incorrect",
                 "required.password": "Saisissez votre mot de passe"
            },
            function (validator) {
                validator.lang = 'fr';
            }
        )
        return {
          email: this.props.email
        };
    },
    render: function() {
        var bsStyle = {};
        var inputs = ['email', 'password'];
        _.map(inputs, function(name){return bsStyle[name] = !_.isEmpty(this.props.getValidationMessages(name))}, this);
        debugger;
        return (
            <form className="form">
                <Input type="email" name="connectEmail" ref="email" onKeyPress={this.handleKey} placeholder="Adresse Email *" onChange={this.handleEmailChange} value={this.state.email} onBlur={this.props.handleValidation('email')} bsStyle={emailStyle} hasFeedback/>
                <Input type="password" ref="password" onKeyPress={this.handleKey} placeholder="Mot de Passe *" onChange={this.handlePasswordChange} value={this.state.password} onBlur={this.props.handleValidation('password')} bsStyle={passStyle} hasFeedback/>
                {this.props.getValidationMessages('email')}
                {this.props.getValidationMessages('password')}
                <a role="button" onClick={this.submit} className="btn btn-red full">Se connecter</a>
                <a role="button" onClick={this.resetPassword} className="forgot-password">Mot de passe oublié ?</a>
            </form>
        );
    },
    handleKey: function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            this.submit();
        }
    },
    handleEmailChange: function (e) {
        this.setState({
            email: e.currentTarget.value
        });
    },
    handlePasswordChange: function (e) {
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
        event.preventDefault();
        this.props.validate(function(error) {
            if (error) {
                //form has errors; do not submit
                console.log('error', error);

            } else {
                //no errors; submit form
                this.context.executeAction(AuthActions.emailConnect, {
                    email: this.state.email,
                    password: this.state.password,
                    withNavigate: this.props.withNavigate
                });
            }
        }.bind(this));
        
	}
});

module.exports = validation(strategy)(FormConnect);