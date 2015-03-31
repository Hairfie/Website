/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var NavLink = require('flux-router-component').NavLink;
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var HairfieStore = require('../../stores/HairfieStore');
var BusinessStore = require('../../stores/BusinessStore');

var BusinessLink = React.createClass({
    render: function () {
        var navParams = {
            businessId  : this.props.business.id,
            businessSlug: this.props.business.slug
        };

        return <NavLink {...this.props} routeName="show_business" navParams={navParams} />;
    }
});

var Hairfies = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: ['HairfieStore']
    },
    getStateFromStores: function () {
        return {
            hairfies: this.getStore(HairfieStore).query({
                where   : {
                    businessId: this.props.business.id
                },
                sort    : 'createdAt DESC',
                limit   : 6
            })
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
            <div className="salon-hairfies">
                <ul>
                    {_.map(this.state.hairfies, this.renderHairfie)}
                    {this.renderMore()}
                </ul>
            </div>
        );
    },
    renderHairfie: function (hairfie, i) {
        var className = i > 2 ? 'hidden-xs' : '';
        if (i > 4) className = className+' hidden-md hidden-sm';

        return (
            <li key={hairfie.id} className={className}>
                <NavLink context={this.props.context} routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                    <Picture picture={hairfie.pictures[0]}
                          resolution={55}
                          placeholder="/images/placeholder-55.png"
                                 alt={'Hairfie de '+hairfie.author.firstName} />
                </NavLink>
            </li>
        );
    },
    renderMore: function () {
        if ((this.state.hairfies || []).length < 6) return;

        return (
            <li className="more">
                <BusinessLink context={this.props.context} business={this.props.business}>
                    <img src="/images/placeholder-hairfie-thumb-more.png" alt="" />
                </BusinessLink>
            </li>
        );
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    propTypes: {
        business: React.PropTypes.object.isRequired,
        context: React.PropTypes.object.isRequired
    },
    getStateFromStores: function (props) {
        var props = props || this.props;

        return {
            business: this.getStore(BusinessStore).getById(props.business.id) || props.business
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    render: function () {
        return (
            <section className="col-xs-12">
                <div className="col-xs-12 col-sm-4 image-bloc">
                    <Picture picture={this.state.business.pictures[0]}
                          resolution={400}
                          placeholder="/images/placeholder-640.png"
                          />
                </div>
                <div className="col-xs-12 col-sm-8 info-bloc">
                    <div className="address-bloc">
                        <h3>
                            <BusinessLink context={this.props.context} business={this.state.business}>
                                {this.state.business.name}
                            </BusinessLink>
                        </h3>
                        <BusinessLink context={this.props.context} business={this.state.business} className="address">
                            {this.state.business.address.street}, {this.state.business.address.zipCode} {this.state.business.address.city}
                        </BusinessLink>
                    </div>
                    {this.renderPricing()}
                    <Hairfies context={this.props.context} business={this.state.business} />
                    <NavLink href={this.makeBookingHref()} className="btn btn-red">
                        Réserver
                    </NavLink>
                    {this.renderRating()}
                </div>
            </section>
        );
    },
    renderPicture: function (picture, alt) {
        if (!picture) return;

        return <img src={picture.url} alt={alt} />
    },
    renderRating: function () {
        if (!this.state.business.numReviews) return;

        var rating = (this.state.business.rating / 10).toPrecision(2);

        return (
            <div className="rating">
                <div className="note">
                    <span>{rating}</span>/10
                </div>
                <BusinessLink context={this.props.context} business={this.state.business} className="small">
                    {this.state.business.numReviews} avis
                </BusinessLink>
            </div>
        );
    },
    renderPricing: function () {
        if (this.state.business.bestDiscount) {
            return (
                <p className="inline-promo">
                    <span className="icon-promo">%</span>
                    -{this.state.business.bestDiscount}% dans tout le salon*
                    {this.renderAveragePrice()}
                </p>
            );
        }

        return (
            <p className="inline-promo">
                &nbsp;
                {this.renderAveragePrice()}
            </p>
        );
    },
    renderAveragePrice: function () {
        var price = this.state.business.averagePrice || {},
            men   = price.men && Math.round(price.men),
            women = price.women && Math.round(price.women);

        if (men && women) {
            return <span className="black">&nbsp;&nbsp;prix moyen homme {men}€ / femme {women}€</span>;
        } else if (men) {
            return <span className="black">&nbsp;&nbsp;prix moyen homme {men}€</span>;
        } else if (women) {
            return <span className="black">&nbsp;&nbsp;prix moyen femme {women}€</span>;
        }
    },
    makeBookingHref: function () {
        if (!this.state.business) return;

        var query = {};
        if (this.props.date) query.date = this.props.date;

        return this.props.context.makeUrl('book_business', {
            businessId: this.state.business.id,
            businessSlug: this.state.business.slug
        }, query);
    }
});
