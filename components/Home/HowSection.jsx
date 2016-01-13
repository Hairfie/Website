'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section home-footer how">
                <h2>Comment ça marche ?</h2>
                <p className="subtitle" />
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        <Picture picture={{url: "/img/icons/search.svg"}} svg={true} style={{width: 64, height: 64}} alt="Trouvez votre coupe" />
                        <h3>S’inspirer</h3>
                        <p>des hairfies postés et trouver son coiffeur</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <Picture picture={{url: "/img/icons/calendar.svg"}} svg={true} style={{width: 64, height: 64}} alt="Prenez RDV avec votre coiffeur" />
                        <h3>Prendre RDV</h3>
                        <p>24/7 gratuitement sans paiement en ligne</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <Picture picture={{url: "/img/icons/heart.svg"}} svg={true} style={{width: 64, height: 64}} alt="Partagez votre #Hairfie" />
                        <h3>Partager</h3>
                        <p>son expérience.<br />Poster un hairfie et un avis.</p>
                    </div>
                </div>
            </section>
       );
    },
});
