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
    renderHairfie: function (hairfie) {
        return (
            <li key={hairfie.id}>
                <NavLink context={this.props.context} routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                    <Picture picture={hairfie.pictures[0]}
                          resolution={{width: 55, height: 55}}
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
                    <img src="/images/placeholder-hairfie-thumb-more.jpg" alt="" />
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
                <div className="col-xs-4 image-bloc">
                    <Picture picture={this.state.business.pictures[0]}
                          resolution={{width: 440, height: 400}} />
                </div>
                <div className="col-xs-8 info-bloc">
                    <h3>
                        <BusinessLink context={this.props.context} business={this.state.business}>
                            {this.state.business.name}
                        </BusinessLink>
                    </h3>
                    <BusinessLink context={this.props.context} business={this.state.business} className="address">
                        {this.state.business.address.street}, {this.state.business.address.zipCode} {this.state.business.address.city}
                    </BusinessLink>
                    {this.renderDiscount()}
                    <Hairfies context={this.props.context} business={this.state.business} />
                    <a href="#" className="btn btn-red">Réserver</a>
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
                <a href="#" className="small">{this.state.business.numReviews} avis</a>
            </div>
        );
    },
    renderDiscount: function () {
        if (!this.state.business.bestDiscount) return;

        return (
            <p className="inline-promo">
                <span className="icon-promo">%</span>
                -{this.state.business.bestDiscount}% dans tout le salon*
                <span className="black">&nbsp;&nbsp;prix moyen ???€</span>
            </p>
        );
    }
});
