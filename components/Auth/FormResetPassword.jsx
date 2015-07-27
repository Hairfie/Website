'use strict';

var React = require('react');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var Input = require('react-bootstrap/Input');
var NotificationActions = require('../../actions/NotificationActions');

module.exports = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function() {
        return (
        <form className="form">
            <Input type="email" ref="email" placeholder="Adresse Email *" defaultValue={this.props.email}/>
            <a role="button" onClick={this.submit} className="btn btn-red full">Récupérer son mot de passe</a>
        </form>
        );
    },
    submit: function() {
        var email = this.refs.email.getValue();
        if (email)
            return this.context.executeAction(AuthActions.askResetPassword, {email: email});
        else
            return this.context.executeAction(
                NotificationActions.notifyFailure,
                "Vous devez accepter les conditions générales d'utilisations pour finaliser l'inscription"
            );
    }
});