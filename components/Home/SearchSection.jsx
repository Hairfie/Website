'use strict';

var React = require('react');
var SearchBar = require('../Layout/SearchBar.jsx');


module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section home-search" id="search">
                <div className="hidden-xs home-search-desktop">
                    <h2>Trouvez le (bon) coiffeur</h2>
                    <p className="subtitle">Une bonne adresse de salon de coiffure, ça ne tombe pas du ciel. Un conseil : faites confiance au bouche à oreille 2.0 avant de prendre RDV. Pour trouver des avis et choisir son coiffeur, c’est bien ici !</p>
                    <div className="row">
                        <SearchBar home={true} {...this.props} />
                    </div>
                </div>
                <div className="visible-xs home-search-mobile text-center">
                    <a className="btn btn-red">Rechercher votre coiffeur</a>
                </div>
            </section>
       );
    },
});