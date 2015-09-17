'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section download">
                <div className="container">
                    <div className="col-sm-6">
                        <h2>Pour poster un Hairfie, téléchargez notre application</h2>
                        <p>Pour avoir toujours Hairfie au bout des doigts et pouvoir poster vos plus beaux #Hairfies, téléchargez notre application iOS et bientôt Android</p>
                        <p>
                            <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="btn-apple center-block" target="_blank">
                                <Picture picture={{url: '/images/btn-apple@2x.png'}} style={{width: 204, height: 64}}/>
                            </a>
                        </p>
                    </div>
                </div>
            </section>
       );
    },
});