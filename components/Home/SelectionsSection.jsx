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
                                <div className="img selection-bons-plans-hairfie" />
                                <h4>Les bons plans</h4>
                                Profiter des coiffeurs pas chers
                        </Link>
                        <Link route="business_search" params={{address: 'Paris--France'}} query={{selections: 'les-meilleurs-coloristes'}} className="selection-item">
                                <div className="img selection-coloristes-hairfie" />
                                <h4>Les meilleurs coloristes</h4>
                                Voir les salons
                        </Link>
                        <Link route="business_search" params={{address: 'Paris--France'}} query={{selections: 'coiffeurs-visagistes'}} className="selection-item">
                                <div className="img selection-visagistes-hairfie" />
                                <h4>Choisir un coiffeur visagiste</h4>
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