'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section how">
                <div className="row">
                    <h2 className="col-sm-3">Hairfie comment ça marche&nbsp;?</h2>
                    <div className="col-sm-3 col-xs-12">
                        <Picture picture={{url: "/img/home/photo-red.svg"}} svg={true} style={{width: 40, height: 100, float: 'left'}} alt="Trouvez votre coupe" />
                        <div className="how-txt">
                            <h3>S’inspirer</h3>
                            <p>des hairfies postés et trouver son coiffeur</p>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-12">
                        <Picture picture={{url: "/img/icons/calendar.svg"}} svg={true} style={{width: 40, height: 100, float: 'left'}} alt="Prenez RDV avec votre coiffeur" />
                        <div className="how-txt">
                            <h3>Prendre RDV</h3>
                            <p>24/7 gratuitement sans paiement en ligne</p>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-12">
                        <Picture picture={{url: "/img/icons/heart.svg"}} svg={true} style={{width: 40, height: 100, float: 'left'}} alt="Partagez votre #Hairfie" />
                        <div className="how-txt">
                            <h3>Partager</h3>
                            <p>son expérience.<br />Poster un hairfie et un avis.</p>
                        </div>
                    </div>
                </div>
            </section>
       );
    },
});
