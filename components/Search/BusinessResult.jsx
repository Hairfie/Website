/** @jsx React.DOM */

'use strict';

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var connectToStores = require('fluxible/addons/connectToStores');

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
    render: function () {
        return (
            <div className="salon-hairfies">
                <ul>
                    {_.map(this.props.hairfies, this.renderHairfie)}
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
                <NavLink routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                    <Picture picture={_.last(hairfie.pictures)}
                             options={{width: 55, height: 55}}
                          placeholder="/images/placeholder-55.png"
                                 alt="" />
                </NavLink>
            </li>
        );
    },
    renderMore: function () {
        if ((this.props.hairfies || []).length < 6) return;

        return (
            <li className="more">
                <BusinessLink business={this.props.business}>
                    <img src="/images/placeholder-hairfie-thumb-more.png" alt="" />
                </BusinessLink>
            </li>
        );
    }
});

Hairfies = connectToStores(Hairfies, [
    require('../../stores/HairfieStore')
], function (stores, props) {
    return {
        hairfies: stores.HairfieStore.query({
            where   : {
                businessId: props.business.id
            },
            order   : 'createdAt DESC',
            limit   : 6
        })
    };
});

var BusinessResult = React.createClass({
    propTypes: {
        business: React.PropTypes.object.isRequired
    },
    contextTypes: {
        makeUrl: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <section className="col-xs-12">
                <div className="col-xs-12 col-sm-4 image-bloc">
                    <BusinessLink business={this.props.business}>
                        <Picture
                            picture={_.first(this.props.business.pictures)}
                            options={{width: 400, height: 400}}
                            placeholder="/images/placeholder-640.png"
                            />
                     </BusinessLink>
                </div>
                <div className="col-xs-12 col-sm-8 info-bloc">
                    <div className="address-bloc">
                        <h3>
                            <BusinessLink business={this.props.business}>
                                {this.props.business.name}
                            </BusinessLink>
                        </h3>
                        <BusinessLink business={this.props.business} className="address">
                            {this.props.business.address.street}, {this.props.business.address.zipCode} {this.props.business.address.city}
                        </BusinessLink>
                    </div>
                    {this.renderPricing()}
                    <Hairfies business={this.props.business} />
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
        if (!this.props.business.numReviews) return;

        var rating = (this.props.business.rating / 10).toPrecision(2);

        return (
            <div className="rating">
                <div className="note">
                    <span>{rating}</span>/10
                </div>
                <BusinessLink business={this.props.business} className="small">
                    {this.props.business.numReviews} avis
                </BusinessLink>
            </div>
        );
    },
    renderPricing: function () {
        if (this.props.business.bestDiscount) {
            return (
                <p className="inline-promo">
                    <span className="icon-promo">%</span>
                    -{this.props.business.bestDiscount}% dans tout le salon*
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
        var price = this.props.business.averagePrice || {},
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
        var query = {};
        if (this.props.date) query.date = this.props.date;

        return this.context.makeUrl('book_business', {
            businessId: this.props.business.id,
            businessSlug: this.props.business.slug
        }, query);
    }
});

module.exports = BusinessResult;
