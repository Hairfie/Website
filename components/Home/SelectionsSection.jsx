'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Link = require('../Link.jsx');

var Selections = React.createClass({
    render: function () {
        return (
            <section className="home-section selections">
                <div>
                    <h2>Nos sélections de salons</h2>
                    <p>
                        L'équipe Hairfie partage ses bonnes adresses. Des pépites de coiffeurs, coloristes et barbiers&nbsp;à ne manquer sous aucun prétexte !
                    </p>
                    <div className="flex-selections">
                        <Link route="business_search" params={{address: 'Paris--France'}} query={{selections: 'les-bons-plans'}} className="selection-item">
                                <div className="img les-bons-plans" />
                                <h4>Les bons plans à Paris</h4>
                                Voir les salons
                        </Link>
                        <Link route="business_search" params={{address: 'Paris--France'}} query={{selections: 'les-meilleurs-coloristes'}} className="selection-item">
                                <div className="img les-meilleurs-coloristes" />
                                <h4>Les coloristes parisiens</h4>
                                Voir les salons
                        </Link>
                        <Link route="business_search" params={{address: 'Paris--France'}} query={{selections: 'les-barbershops'}} className="selection-item">
                                <div className="img les-barbershops" />
                                <h4>Les barbiers à Paris</h4>
                                Voir les salons
                        </Link>
                    </div>
                </div>
            </section>
       );
    },
});

Selections = connectToStores(Selections, ['SelectionStore'], function (context) {
    return {
        selections: context.getStore('SelectionStore').getSelections()
    };
});

module.exports = Selections;