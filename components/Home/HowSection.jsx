'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section how">
                <div className="row">
                    <h2 className="col-sm-3 col-xs-12">Hairfie comment ça marche&nbsp;?</h2>
                    <div className="col-sm-3 col-sm-offset-0 col-xs-9 col-xs-offset-2">
                        <Picture picture={{url: "/img/icons/calendar.svg"}} svg={true} style={{width: 40, height: 100, float: 'left'}} alt="Prenez RDV avec votre coiffeur" />
                        <div className="how-txt">
                            <h3>Prendre RDV</h3>
                            <p>24/7 gratuitement sans paiement en ligne</p>
                        </div>
                    </div>
                    <div className="col-sm-3 col-sm-offset-0 col-xs-9 col-xs-offset-2">
                        <Picture picture={{url: "/img/howitworks/new-hairfie.svg"}} svg={true} style={{width: 40, height: 100, float: 'left'}} alt="Trouvez votre coupe" />
                        <div className="how-txt">
                            <h3>Découvrir</h3>
                            <p>des nouvelles coupes postées par notre communauté</p>
                        </div>
                    </div>
                    <div className="col-sm-3 col-sm-offset-0 col-xs-9 col-xs-offset-2">
                        <Picture picture={{url: "/img/icons/heart.svg"}} svg={true} style={{width: 40, height: 100, float: 'left'}} alt="Partagez votre #Hairfie" />
                        <div className="how-txt">
                            <h3>Partager</h3>
                            <p>votre expérience en postant un avis & un hairfie</p>
                        </div>
                    </div>
                </div>
            </section>
       );
    },
});
