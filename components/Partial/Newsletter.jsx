'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;
var connectToStores = require('fluxible-addons-react/connectToStores');
var SubscriberActions = require('../../actions/SubscriberActions');
var NotificationActions = require('../../actions/NotificationActions');

var Newsletter = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        if (!this.props.open) return null;
        return (
            <div className="newsletter-banner">
                <p>
                    Ne manquez rien, inscrivez-vous à la Newsletter :
                </p>
                <div className="col-xs-offset-2 col-sm-offset-0 col-xs-6 col-sm-4">
                    <Input type="email" ref="email" placeholder="Adresse Email *"/>
                </div>
                <a role="button" className='btn btn-red col-xs-2 col-sm-1' onClick={this.submit} >
                    OK
                </a>
            </div>
        );
    },
    close: function() {
        this.context.executeAction(SubscriberActions.hasClosedBanner);
    },
    submit: function() {
        var email = this.refs.email.getValue();
        if (validateEmail(email)) {
            this.context.executeAction(SubscriberActions.submit, {
                subscriber        : {
                    email       : email
                }
            });
        }
        else {
            this.context.executeAction(NotificationActions.notifyError, {
                title       : "Erreur",
                message     : "L'email entré semble incorrect."
            });
        }
    }
});

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

Newsletter = connectToStores(Newsletter, [
    'AuthStore'
], function (context, props) {
    return {
        open: context.getStore('AuthStore').shouldOpenBanner()
    };
});

module.exports = Newsletter;