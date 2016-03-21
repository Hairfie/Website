'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var Picture = require('../Partial/Picture.jsx');
var NavigationActions = require('../../actions/NavigationActions');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <section className="home-section deals">
                <h2>Trouvez les meilleures adresses de salon</h2>
                <p className="subtitle">Pour trouver le bon salon de coiffure, vous êtes pile au bon endroit ! Faites confiance aux avis et jetez un coup d'oeil aux hairfies du salon (photos de coiffure) pour prendre rendez-vous avec le coiffeur qui vous correspond.</p>
                {_.map(_.chunk(this.props.deals, 3), this.renderDealsRow)}
                <div className="text-center">
                    <Link className="btn btn-whitered" route="business_search" params={{address: 'France'}} query={{withDiscount: true}}>Voir plus de salons</Link>
                </div>
            </section>
        );
    },
    renderDealsRow: function (deals, i) {
        return (
            <div key={i} className="row">
                {_.map(deals, this.renderDeal)}
            </div>
        );
    },
    renderDeal: function (deal) {
        var displayAddress = deal.business.address ? deal.business.address.street + ' ' + deal.business.address.city : null;
        var discount = deal.discount > 0 ? <span className="icon-promo">{deal.discount + '%'}</span> : null;

        return (
            <div className="col-sm-4 col-xs-12" key={deal.business.id} onClick={this.navigate.bind(null, deal)}>
                <figure>
                    <Picture picture={deal.business.pictures[0]} resolution={{width: 640, height: 400}} placeholder="/img/placeholder-640.png" alt={deal.business.name} onClick={this.navToLink.bind(this, "business", {businessId: deal.business.id, businessSlug: deal.business.slug}, null)} />
                    <figcaption>
                        <Link route="business" params={{ businessId: deal.business.id, businessSlug: deal.business.slug }}>
                            {deal.business.name}
                        </Link>
                        <Link className="address" route="business" params={{ businessId: deal.business.id, businessSlug: deal.business.slug }}>
                            {displayAddress}
                        </Link>
                        {discount}
                    </figcaption>
                </figure>
            </div>
        );
    },
    navigate: function(deal, e) {
        e.preventDefault();
        return this.context.executeAction(NavigationActions.navigate, {
            route: 'business',
            params: { businessId: deal.business.id, businessSlug: deal.business.slug }
        });
    },
});
