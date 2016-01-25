'use strict';
var React = require('react');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section download">
                <div className="container">
                    <div className="col-sm-6">
                        <h2>Partagez vous aussi votre coiffure&nbsp;!</h2>
                        <p className="subtitle">Pour poster un hairfie, téléchargez l’application mobile. Une photo envoyée sur Hairfie et c’est toute la communauté qui vous remercie !</p>
                        <p className="center-block buttons">
                            <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="btn-apple col-sm-6 col-xs-12" target="_blank">
                                <Picture picture={{url: '/img/btn-apple@2x.png'}} alt="Hairfie sur iOS Appstore" style={{width: 204, height: 64}}/>
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.hairfie.hairfie" className="btn-apple col-sm-6 col-xs-12" target="_blank">
                                <Picture picture={{url: '/img/btn-play-dl.png'}} alt="Hairfie sur Android" style={{width: 216, height: 64}} />
                            </a>
                        </p>
                    </div>
                </div>
            </section>
       );
    },
});