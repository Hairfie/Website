'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

var Styles = React.createClass({
    render: function () {
        return (
            <section className="home-section styles" id="styles" ref="styles">
                <h2>Choisissez votre style</h2>
                <p className="subtitle">Pas encore décidé(e) ? Venez trouver votre style parmis des milliers de photos de coupes, couleurs et coiffures. Sombré, broux, carré wavy, coupe pixie, barbe… Faites défiler les hairfies et suivez les tendances.</p>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="sm-sqr col-sm-6 col-xs-6">
                            <Link route="hairfie_search" params={{ address: 'France' }} query={{ tags: ['Carré droit', 'Carré plongeant', 'Carré long'] }}>
                                <div className="background carre">
                                    <StyleContent style="Carré"/>
                                </div>
                            </Link>
                        </div>
                        <div className="sm-sqr col-sm-6 col-xs-6">
                            <Link route="hairfie_search" params={{ address: 'France' }} query={{ tags: 'Homme' }}>
                                <div className="background homme">
                                    <StyleContent style="Homme"/>
                                </div>
                            </Link>
                        </div>
                        <div className="rectangle col-sm-12 col-xs-6">
                            <Link route="hairfie_search" params={{ address: 'France' }} query={{ tags: 'Mariage' }}>
                                <div className="background mariage">
                                    <StyleContent style="Mariage"/>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="big-sqr col-sm-6 col-xs-6">
                        <Link route="hairfie_search" params={{ address: 'France' }} query={{ tags: 'Avant-après' }}>
                            <div className="background avant-apres">
                                <StyleContent style="Avant / Après"/>
                            </div>
                        </Link>
                    </div>
                    <Link className="btn btn-whitered" route="hairfie_search" params={{address: 'France'}}>
                        Voir tous les hairfies
                    </Link>
                </div>
            </section>
        );
    }
});

var StyleContent = React.createClass({
    render: function () {
        return (
            <div id="style-content">
                <div className="title">Nos hairfies</div>
                <div className="style">{this.props.style}</div>
            </div>
        );
    }
});

module.exports = Styles;