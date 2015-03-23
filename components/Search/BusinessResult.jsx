/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var NavLink = require('flux-router-component').NavLink;
var _ = require('lodash');

var HAIRFIE_IDS = [
    '8bd05981-dcef-4f3b-84e1-7641b2f6dc37',
    '21cb027e-f404-4326-bcc5-f1d5aaf2fad5',
    'ab13041f-0365-49f6-98be-6e7c571a6230',
    'ae42feb4-8c0d-44f3-8f7b-ada4ebfa30e7',
    'ba8a702c-9699-4a88-b9b3-269863252142',
    '08cc8f6b-ae18-4cbd-a564-529191b07bba'
];

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
        var store = this.getStore('HairfieStore');

        return {
            hairfies: _.filter(_.map(HAIRFIE_IDS, store.getById, store), _.isObject)
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
                </ul>
            </div>
        );
    },
    renderHairfie: function (hairfie) {
        return (
            <li key={hairfie.id}>
                <NavLink context={this.props.context} routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                    <img src="http://placehold.it/55/55" alt="" />
                </NavLink>
            </li>
        );
    }
});

module.exports = React.createClass({
    propTypes: {
        business: React.PropTypes.object.isRequired,
        context: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <section className="col-xs-12">
                <div className="col-xs-4">
                    <img src="http://lucasfayolle.com/hairfie/images/placeholder-salon-thumb.jpg" alt="" />
                </div>
                <div className="col-xs-8">
                    <h3>
                        <BusinessLink context={this.props.context} business={this.props.business}>
                            {this.props.business.name}
                        </BusinessLink>
                    </h3>
                    <BusinessLink context={this.props.context} business={this.props.business} className="address">
                        {this.props.business.address.street}, {this.props.business.address.zipCode} {this.props.business.address.city}
                    </BusinessLink>
                    <p className="inline-promo">
                        <span className="icon-promo">%</span>
                        -30% dans tout le salon*
                        <span className="black">&nbsp;&nbsp;prix moyen 50€</span>
                    </p>
                    <Hairfies context={this.props.context} business={this.props.business} />
                    <a href="#" className="btn btn-red">Réserver</a>
                    <div className="rating">
                        <div className="note">
                            <span>9,6</span>/10
                        </div>
                        <a href="#" className="small">230 avis</a>
                    </div>
                </div>
            </section>
        );
    }
});
