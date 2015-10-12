'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <section className="home-section hairfies">
                <h2>Nos Hairfies préférés</h2>
                <div className="row">
                    <div className="col-md-6 col-xs-12 small-hairfies">
                        <div className="row">
                            {_.map(_.rest(this.props.hairfies), function(h){ return this.renderHairfie(h, "col-xs-6")}, this)}
                        </div>
                    </div>

                    {this.renderHairfie(_.first(this.props.hairfies), 'col-md-6 col-xs-12 big', 'col-xs-12')}
                </div>
                <Link route="hairfie_search" params={{ address: 'Paris--France' }} className="btn btn-red home-cta col-md-3 col-xs-10">
                    Plus de hairfies
                </Link>
            </section>
        );
    },
    renderHairfie: function (hairfie, hairfieClass, figureClass) {
        if (!hairfie) return;

        var picture = _.last(hairfie.pictures);
        var priceNode;
        if(hairfie.price) priceNode = <div className="pricetag">{hairfie.price.amount}{hairfie.price.currency == "EUR" ? "€" : ""}</div>;

        var displayBusinessName = hairfie.business ? hairfie.business.name : null;
        var displayBusinessAddress = hairfie.business ? hairfie.business.address.street + ' ' + hairfie.business.address.city : null;

        return (
            <div className={hairfieClass} onClick={this.navToLink.bind(this, "hairfie", {hairfieId: hairfie.id}, null)} key={hairfie.id}>
                <figure className={figureClass}>
                    <Picture picture={picture} alt={hairfie.description} />
                    <figcaption>
                        <Link route="hairfie" params={{hairfieId: hairfie.id}}>
                            {displayBusinessName}
                        </Link>
                        <Link className="address" route="hairfie" params={{hairfieId: hairfie.id}}>
                            {displayBusinessAddress}
                        </Link>
                        {priceNode}
                    </figcaption>
                    <div className="clearfix" />
                </figure>
            </div>
        );
    }
});
