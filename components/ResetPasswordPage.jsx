'use strict';

var React = require('react');
var Layout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var AuthActions = require('../actions/AuthActions');
var connectToStores = require('../lib/connectToStores');

var ResetPasswordPage =  React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        return (
            <Layout context={this.props.context}>
                <h2>Réinitialisation de votre mot de passe</h2>
                <Input type="password" ref="password" label="Saisissez un nouveau mot de passe" />
                <Button onClick={this.submit}>Valider</Button>
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
        token: stores.AuthStore.getById(props.route.params.tokenId)
    };
});

module.exports = ResetPasswordPage;
