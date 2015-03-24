/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var NavLink = require('flux-router-component').NavLink;
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var HairfieStore = require('../../stores/HairfieStore');

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
                </ul>
            </div>
        );
    },
    renderHairfie: function (hairfie) {
        return (
            <li key={hairfie.id}>
                <NavLink context={this.props.context} routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                    <Picture picture={hairfie.pictures[0]}
                               width={55}
                              height={55}
                                 alt={'Hairfie de '+hairfie.author.firstName} />
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
                    <Picture picture={this.props.business.pictures[0]}
                               width={440}
                              height={400} />
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
    },
    renderPicture: function (picture, alt) {
        if (!picture) return;

        return <img src={picture.url} alt={alt} />
    }
});
