'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;
var connectToStores = require('fluxible-addons-react/connectToStores');
var SubscriberActions = require('../../Actions/SubscriberActions');

var Newsletter = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        if (!this.props.open) return null;
        return (
            <div className="newsletter-banner">
                <p className="col-xs-12 col-sm-5 col-md-4 col-lg-3">
                    Ne manquez rien, abonnez-vous à la Newsletter :
                </p>
                <div className="col-xs-6 col-sm-4 col-md-5 col-lg-6">
                    <Input type="email" ref="email" placeholder="Adresse Email *"/>
                </div>
                <a role="button" className='btn btn-red col-xs-4 col-sm-2' onClick={this.submit} >
                    Valider
                </a>
                <div className="col-xs-2 col-sm-1">
                    <a role="button" className="close-newsletter" onClick={this.close}/>
                </div>
            </div>
        );
    },
    close: function() {
        this.context.executeAction(SubscriberActions.hasClosedBanner);
    },
    submit: function() {
        var email = this.refs.email.getValue();

        this.context.executeAction(SubscriberActions.submit, {
            subscriber        : {
                email       : email
            }
        });
    }
});

Newsletter = connectToStores(Newsletter, [
    'AuthStore'
], function (context, props) {
    return {
        open: context.getStore('AuthStore').shouldOpenBanner()
    };
});

module.exports = Newsletter;