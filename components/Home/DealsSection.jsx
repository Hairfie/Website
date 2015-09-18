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
            <section className="home-section deals">
                <h2>Nos offres actuelles</h2>
                {_.map(_.chunk(this.props.deals, 3), this.renderDealsRow)}
                <Link className="btn btn-red home-cta col-md-3 col-xs-10" route="business_search" params={{address: 'Paris--France'}} query={{withDiscount: true}}>Plus de promotions</Link>
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

        return (
            <div className="col-sm-4 col-xs-12" key={deal.business.id}>
                <figure>
                    <Picture picture={deal.business.pictures[0]} resolution={{width: 640, height: 400}} placeholder="/images/placeholder-640.png" alt={deal.business.name} onClick={this.navToLink.bind(this, "business", {businessId: deal.business.id, businessSlug: deal.business.slug}, null)} />
                    <figcaption>
                        <Link route="business" params={{ businessId: deal.business.id, businessSlug: deal.business.slug }}>
                            {deal.business.name}
                        </Link>
                        <Link className="address" route="business" params={{ businessId: deal.business.id, businessSlug: deal.business.slug }}>
                            {displayAddress}
                        </Link>
                        <span className="icon-promo">{deal.discount}%</span>
                    </figcaption>
                </figure>
            </div>
        );
    },
});
