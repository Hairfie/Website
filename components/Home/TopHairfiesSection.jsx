'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var Picture = require('../Partial/Picture.jsx');
var Hairfie = require('../Partial/Hairfie.jsx');
module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <section className="home-section hairfies">
                <h2>Les coiffures stylées sur Hairfie</h2>
                <p className="subtitle">Ici, on s’inspire de photos de vrais clients pour choisir le bon coiffeur qui réalisera la coiffure de son choix. Coupes structurées, couleurs lumineuses, chignons de fête, lissages en souplesse... Il y en a pour toutes les envies !</p>
                <div className="row">
                    <div className="col-md-6 col-xs-12 hairfies">
                            <div className="row">
                                {_.map(_.rest(this.props.hairfies), function(hairfie) {
                                    return <Hairfie hairfie={hairfie} className="col-xs-6 single-hairfie" />;
                                })}
                            </div>
                    </div>

                    <Hairfie hairfie={_.first(this.props.hairfies)} className="col-md-6 col-xs-12 big single-hairfie" />
                </div>
                <Link route="hairfie_search" params={{ address: 'Paris--France' }} className="btn btn-red home-cta col-md-3 col-xs-10">
                    Plus de hairfies
                </Link>
            </section>
        );
    }
});
