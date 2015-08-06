'use strict';

var React = require('react');
var Layout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var AuthActions = require('../actions/AuthActions');
var connectToStores = require('../lib/connectToStores');

var ResetPasswordPage =  React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        return (
            <Layout context={this.props.context}>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <h2>Réinitialisation de votre mot de passe</h2>
                    <p style={{fontSize: '1.4em'}}>Saisissez un nouveau mot de passe:</p>
                    <Input type="password" ref="password" />
                    <a role="button" onClick={this.submit} className="btn btn-red full">Valider</a>
                </div>
            </Layout>
        );
    },
    submit: function () {
        this.context.executeAction(AuthActions.resetPassword, {
            token   : this.props.token,
            password: this.refs.password.getValue()
        });
    }
});

ResetPasswordPage = connectToStores(ResetPasswordPage, [
    'AuthStore'
], function (stores, props) {
    return {
        token: stores.AuthStore.getToken()
    };
});

module.exports = ResetPasswordPage;
