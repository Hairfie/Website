'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section home-footer">
                <h2>Comment ça marche ?</h2>
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        <Picture picture={{url: "/img/search.png"}} alt="#" />
                        <h3>Découvrez</h3>
                        <p>Parcourez nos #Hairfies pour trouver la coiffure qui vous correspond</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <Picture picture={{url: "/img/book.png"}} alt="#" />
                        <h3>Prenez RDV</h3>
                        <p>Réservez votre coiffeur gratuitement en 3 clics, 24/7</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <Picture picture={{url: "/img/share.png"}} alt="#" />
                        <h3>Partagez</h3>
                        <p>Partagez votre #Hairfie <br />et donnez votre avis</p>
                    </div>
                </div>
            </section>
       );
    },
});
