/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var TopDealsStore = require('../../stores/TopDealsStore');
var lodash = require('lodash');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [TopDealsStore]
    },
    getStateFromStores: function () {
        return {
            topDeals   : this.getStore(TopDealsStore).get(this.props.numTopDeals)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        return (
            <section className="home-section">
                <h2>Les bon plans de la semaine</h2>
                <div className="row">
                    {lodash.map(this.state.topDeals, this.renderDeal).slice(0, 3)}
                </div>
                <div className="row">
                    {lodash.map(this.state.topDeals, this.renderDeal).slice(3, 6)}
                </div>
                <a href="#" className="btn btn-red home-cta col-md-3 col-xs-10">Plus de bons plans</a>
            </section>
        );
    },
    renderDeal: function (deal) {
        var displayAddress = deal.business.address ? deal.business.address.street + ' ' + deal.business.address.city : null;
        return (
            <div className="col-sm-4 col-xs-12">
                <figure>
                    <img src={deal.business.pictures[0].url} alt={deal.business.name} />
                    <figcaption>
                        <NavLink routeName="show_business" navParams={{businessId: deal.business.id, businessSlug: deal.business.slug}} context={this.props.context}>
                            {deal.business.name}
                        </NavLink>
                        <NavLink className="address" routeName="show_business" navParams={{businessId: deal.business.id, businessSlug: deal.business.slug}} context={this.props.context}>
                            {displayAddress}
                        </NavLink>
                        <span className="icon-promo">{deal.discount}%</span>
                    </figcaption>
                </figure>
            </div>
        );
    }
});