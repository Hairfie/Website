'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var OSDetector = require('../services/OSDetector');

var SMSPage = React.createClass({
    render: function () {
        debugger;
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
                                <a href={this.smsLink()} className="btn btn-book">0644600250</a>
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
        debugger;
        if (detector) {
            console.log('version', detector.version());
            console.log('os', detector.os());
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
