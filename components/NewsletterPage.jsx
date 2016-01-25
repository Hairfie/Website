'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var Newsletter = require('./Partial/Newsletter.jsx');
var Breadcrumb = require('./Partial/Breadcrumb.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');

var NewsletterPage = React.createClass({
    render: function () {
        return (
            <PublicLayout>
                <div className="container">
                    <Breadcrumb business={this.props.business} />
                    <div className="newsletter" id="content">
                        <div className="row">
                            <div className="col-xs-12">
                                {this.displayThankYouMessage()}
                                <h3>Retrouvez le meilleur de la coiffure dans votre boite mail&nbsp;!​<br/><small>Envie d'être au top côté coiffure ?</small></h3>
                                <p>
                                    Chaque semaine, Hairfie vous réserve :
                                </p>
                                <ul>
                                    <li><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> des bonnes adresses pour vos cheveux</li>
                                    <li><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> des conseils de coiffeurs experts</li>
                                    <li><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> des décryptages de tendances</li>
                                    <li><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> des bons plans coiffure</li>
                                    <li><span className="glyphicon glyphicon-ok" aria-hidden="true"></span> des promotions sur les salons</li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="hairfie-newsletter col-xs-12">
                                <Newsletter alwaysDisplayed={true} />
                            </div>
                            <em className="spam-note">
                                Promis, on garde l'email pour nous et pas de spam.
                            </em>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    displayThankYouMessage: function() {
        if(this.props.hasRegisteredEmail) {
            return (<div className="row">
                        <div className="success bg-success">
                            <span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Merci, votre email <em>{this.props.email}</em> a bien été enregistré !
                        </div>
                    </div>); 
        }
    }
});

NewsletterPage = connectToStores(NewsletterPage, [
    'SubscriberStore'
], function (context, props) {
    return {
        hasRegisteredEmail: context.getStore('SubscriberStore').getEmailRegistrationStatus(),
        email: context.getStore('SubscriberStore').getEmail()
    };
});

module.exports = NewsletterPage;
