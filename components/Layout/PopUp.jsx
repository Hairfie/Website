'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

var PopUp = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function() {
        if (this.props.tab == "business") {
            return this.renderBusiness();
        }
        else if (this.props.tab == "hairfie") {
            return this.renderHairfie();
        }
    },
    renderBusiness: function() {
        return (
            <div className="PopUp">
                <div className="link-list">
                    <p className="title">NOS SPÉCIALISTES</p>
                    <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'coloration'}}>Coloration à Paris</Link>
                    <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'balayage-tie-and-dye'}}>Balayage à Paris</Link>
                    <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'lissage'}}>Lissage à Paris</Link>
                    <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'ethnique'}}>Afro à Paris</Link>
                    <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'mariage'}}>Coiffure de Mariage</Link>
                    <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'barbier'}}>Barbiers à Paris</Link>
                    <Link className="color-hairfie" route="business_search" params={{address: 'France'}}>Voir tous nos coiffeurs</Link>
                </div>
                <Link route="business_search" params={{address: 'Paris--France'}} query={{categories: 'coloration'}} className="picture" style={{marginRight: '10px'}}>
                    <Picture picture={{url: '/img/static-image/salon1.jpg'}} style={{width: '100%'}}/>
                    <div>
                        <p className="title">Coloration à Paris</p>
                        <p>Laissez-vous tenter par nos spécialistes de la coloration.</p>
                    </div>
                </Link>
                <Link route="business_search" params={{address: 'France'}} className="picture">
                    <Picture picture={{url: '/img/static-image/salon2.jpg'}} style={{width: '100%'}}/>
                    <div>
                        <p className="title">Tous nos coiffeurs</p>
                        <p>Découvrez les meilleurs salons de coiffure autour de vous.</p>
                    </div>
                </Link>
            </div>
        );
    },
    renderHairfie: function() {
        return (
            <div className="PopUp">
                <div className="link-list">
                    <p className="title">NOS HAIRFIES</p>
                    <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Carré'}}>Carré plongeant</Link>
                    <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Balayage'}}>Balayage</Link>
                    <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Tie & Dye'}}>Tie and dye</Link>
                    <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Court'}}>Coupe courte</Link>
                    <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Lissage brésilien'}}>Lissage brésilien</Link>
                    <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Avant / Après'}}>Avant / Après</Link>
                    <Link className="color-hairfie" route="hairfie_search" params={{address: 'France'}}>Voir tous nos hairfies</Link>
                </div>
                <Link route="hairfie_search" params={{address: 'Paris--France'}} query={{tags: 'Tie & Dye'}} className="picture" style={{marginRight: '10px'}}>
                        <Picture picture={{url: '/img/static-image/Hairfie1.jpg'}} style={{width: '100%'}}/>
                        <div>
                            <p className="title">Tie and Dye à Paris</p>
                            <p>Laissez-vous tenter par nos spécialistes du Tie and Dye</p>
                        </div>
                </Link>
                <Link route="hairfie_search" params={{address: 'France'}} className="picture">
                    <Picture picture={{url: '/img/static-image/Hairfie2.jpg'}} style={{width: '100%'}}/>
                    <div>
                        <p className="title">Tous nos hairfies</p>
                        <p>Inspirez-vous de nos photos de styles et coiffures tendance.</p>
                    </div>
                </Link>
            </div>
        );
    }
});

module.exports = PopUp;