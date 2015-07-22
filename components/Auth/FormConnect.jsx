'use strict';

var React = require('react');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var Input = require('react-bootstrap/Input');

module.exports = React.createClass({
	contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function () {
        return {reset_pwd: false}
    },
	render: function() {
		return (
        <form className="form">
            <Input type="email" ref="email" placeholder="Adresse Email *"/>
            <Input type="password" ref="password" placeholder="Mot de Passe *" />
            <a role="button" onClick={this.handleResetPasswordChanged} className="green">Mot de passe oublié ?</a>
            {this.renderResetPassword()}
            <a role="button" onClick={this.submit} className="btn btn-red full">Se connecter</a>
        </form>
		);
	},
    renderResetPassword: function() {
        if (!this.state.reset_pwd) return;
            return (<p>Veuillez indiquer votre email dans le champ email et recliquer sur mot de passe oublié</p>);
    },
	submit: function() {
        var email = this.refs.email.getValue();
        var password = this.refs.password.getValue();
        this.context.executeAction(AuthActions.emailConnect, { email: email, password: password, withNavigate: this.props.withNavigate });
	},
    handleResetPasswordChanged: function() {
        var email = this.refs.email.getValue();
        if (email) {
            this.context.executeAction(AuthActions.askResetPassword, {email: email});
            this.setState({reset_pwd: false});
            return;
        }
        this.setState({reset_pwd: true});
    }
});