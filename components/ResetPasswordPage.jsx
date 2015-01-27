/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var PasswordRecoveryStore = require('../stores/PasswordRecoveryStore');
var AuthActions = require('../actions/Auth');
var Layout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [PasswordRecoveryStore]
    },
    getStateFromStores: function () {
        var passwordRecoveryStore = this.getStore(PasswordRecoveryStore),
            userId                = this.props.route.params.userId,
            token                 = this.props.route.params.token,
            status                = passwordRecoveryStore.getStatus(userId, token);

        return {
            userId  : userId,
            token   : token,
            expired : status.expired,
            success : status.success,
            sending : status.sending
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var body;
        if (this.state.expired) {
            body = this.renderExpiredBody();
        } else if (this.state.success) {
            body = this.renderSuccessBody();
        } else {
            body = this.renderFormBody();
        }

        return (
            <Layout context={this.props.context}>
                <h2>Réinitialisation de votre mot de passe</h2>
                {body}
            </Layout>
        );
    },
    renderExpiredBody: function () {
        return <p>Le jeton de réinitialisation est expiré. Si vous êtes toujours à la recherche de votre mot de passe, veuillez recommencer le processus de réinitialisation de mot de passe.</p>;
    },
    renderSuccessBody: function () {
        return <p>Votre nouveau mot de passe a bien été pris en compte, vous pouvez maintenant vous connecter avec.</p>
    },
    renderFormBody: function () {
        var button;
        if (this.state.sending) {
            button = <Button disabled>Envoi en cours...</Button>
        } else {
            button = <Button onClick={this.submitNewPassword}>Valider</Button>
        }

        return (
            <div>
                <Input type="password" ref="password" label="Saisissez un nouveau mot de passe" />
                {button}
            </div>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    submitNewPassword: function () {
        this.props.context.executeAction(AuthActions.ResetPassword, {
            userId  : this.state.userId,
            token   : this.state.token,
            password: this.refs.password.getValue()
        });
    }
});
