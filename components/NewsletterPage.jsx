'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var Newsletter = require('./Partial/Newsletter.jsx');

var NewsletterPage = React.createClass({
    render: function () {
        return (
            <PublicLayout>
                <div className="container newsletter" id="content">
                    <div className="row">
                        <div className="col-xs-12">
                        <h3>Retrouvez le meilleur de la coiffure dans votre boite mail !​<br/><small>Envie d'être au top côté coiffure ?</small></h3>
                            <p>
                                Chaque semaine, Hairfie vous réserve :
                            </p>
                            <ul>
                                <li>des bonnes adresses pour vos cheveux</li>
                                <li>des conseils de coiffeurs experts</li>
                                <li>des décryptages de tendances</li>
                                <li>des bons plans coiffure</li>
                                <li>des promotions sur les salons</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">

                            <div className="hairfie-newsletter col-xs-12">
                                <Newsletter />
                            </div>
                            <em>
                                Promis, on garde l'email pour nous et pas de spam.
                            </em>
                    </div>
                </div>
            </PublicLayout>
        );
    }
});


module.exports = NewsletterPage;
