'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var OSDetector = require('../services/OSDetector');

var SMSPage = React.createClass({
    render: function () {
        return (
            <PublicLayout customClass="bg-white">
                <div className="container">
                    <div className="sms" id="content">
                        <div className="row">
                            <div className="col-xs-12 flex-container">
                                <h3>Nous contacter gratuitement par SMS</h3>
                                <hr className="hr" />
                                <p className="legend">En envoyant un SMS au 06 44 60 02 50, Hairfie répond gratuitement à toutes vos questions pour vos cheveux et votre coiffure.</p>
                                <p>"Salut Hairfie, je voudrais aller chez le coiffeur aujourd'hui. Peux-tu m'aider ?"</p>
                                <p>"Bonjour Hairfie, je cherche le meilleur spécialiste du balayage à Paris ! Peux tu m'aider ?"</p>
                                <p>"Hello Hairfie, j'ai un énorme problème avec mes cheveux ! On a complétement raté ma coloration... Je ne sais pas quoi faire pour la rattraper. Besoin de conseils !!"</p>
                                <a href={this.smsLink()} className="btn btn-book">0644600250</a>
                                <p className="legend">Hairfie et son équipe de coiffeurs partenaires mobilisent tout leur savoir pour répondre à vos questions de 8h à 22h 7/7. Laissez nous juste  le temps de trouver la réponse la mieux adaptée à votre recherche !
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    smsLink: function() {
        var detector = OSDetector();
        var SMSLink = "sms:+33644600250?body=Salut Hairfie,";
        var replaceBody = false;
        if (detector) {
            switch (detector.os()) {
                case 'iOS':
                    if (parseFloat(detector.version()) <= 8) {
                        replaceBody = ';';
                    } else {
                        replaceBody = '&';
                    }
                    break;
                default:
                    break;
            }
            if (replaceBody) {
                SMSLink=SMSLink.replace(/\?body=/, replaceBody + 'body=');
            }
            return SMSLink;
        }
    }
});


module.exports = SMSPage;
