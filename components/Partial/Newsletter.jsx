'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var connectToStores = require('fluxible-addons-react/connectToStores');
var SubscriberActions = require('../../actions/SubscriberActions');
var NotificationActions = require('../../actions/NotificationActions');

var Newsletter = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            email: null
        };
    },
    getDefaultProps: function () {
        return {
            alwaysDisplayed: false
        };
    },
    render: function () {
        if ((!this.props.open || this.props.currentUser) && !this.props.alwaysDisplayed) return null;

        var button = (
            <Button onClick={this.submit} className="btn-addon">
                OK
            </Button>
        );

        return (
            <div className="newsletter-banner">
                <p className="newsletter-legend">
                    Ne manquez rien, inscrivez-vous à la Newsletter&nbsp;!
                </p>
                <div className="col-xs-12 col-sm-6">
                    <Input type="email" ref="email" onKeyPress={this.handleKey} onChange={this.handleEmailChange} value={this.state.email} placeholder="Adresse Email" buttonAfter={button}/>
                </div>
            </div>
        );
    },
    handleKey: function(e) {
        if(e && e.charCode == 13) {
            e.preventDefault();
            this.submit();
        }
    },
    handleEmailChange: function(e) {
        this.setState({email: e.currentTarget.value});
    },
    close: function() {
        this.context.executeAction(SubscriberActions.hasClosedBanner);
    },
    submit: function() {
        var email = this.refs.email.getValue();
        if (validateEmail(email)) {
            if(typeof heap !== "undefined") {
                heap.identify({email: email});
            }
            this.context.executeAction(SubscriberActions.submit, {
                subscriber        : {
                    email       : email
                }
            });
            this.setState({email: null});
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
    'AuthStore',
    'UserStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        open: context.getStore('AuthStore').shouldOpenBanner(),
        currentUser: context.getStore('UserStore').getById(token.userId)
    };
});

module.exports = Newsletter;