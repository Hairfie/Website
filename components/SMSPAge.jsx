'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var Newsletter = require('./Partial/Newsletter.jsx');

var NewsletterPage = React.createClass({
    render: function () {
        return (
            <PublicLayout customClass="bg-white">
                <div className="container">
                    <div className="sms" id="content">
                        <div className="row">
                            <div className="col-xs-12 flex-container">
                                <h3>Nous contacter gratuitement par SMS</h3>
                                <hr className="hr" />
                                <p>"Salut Hairfie, je voudrais aller chez le coiffeur aujourd'hui. Peux-tu m'aider ?"</p>
                                <p>"Bonjour Hairfie, je cherche le meilleur spécialiste du balayage à Paris ! Peux tu m'aider ?"</p>
                                <p>"Hello Hairfie, j'ai un énorme problème avec mes cheveux ! On a complétement raté ma coloration... Je ne sais pas quoi faire pour la rattraper. Besoin de conseils !!"</p>
                                <a href="sms:+33644600250" className="btn btn-book">0644600250</a>
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }
});


module.exports = NewsletterPage;
