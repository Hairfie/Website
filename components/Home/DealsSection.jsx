/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');
var NavLink = require('flux-router-component').NavLink;
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <section className="home-section">
                <h2>Nos offres actuelles</h2>
                {_.map(_.chunk(this.props.deals, 3), this.renderDealsRow)}
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
                    <Picture picture={deal.business.pictures[0]} resolution={{width: 640, height: 400}} placeholder="/images/placeholder-640.png" alt={deal.business.name} onClick={this.navToLink.bind(this, "show_business", {businessId: deal.business.id, businessSlug: deal.business.slug}, null)} />
                    <figcaption>
                        <NavLink routeName="show_business" navParams={{businessId: deal.business.id, businessSlug: deal.business.slug}}>
                            {deal.business.name}
                        </NavLink>
                        <NavLink className="address" routeName="show_business" navParams={{businessId: deal.business.id, businessSlug: deal.business.slug}}>
                            {displayAddress}
                        </NavLink>
                        <span className="icon-promo">{deal.discount}%</span>
                    </figcaption>
                </figure>
            </div>
        );
    },
});
