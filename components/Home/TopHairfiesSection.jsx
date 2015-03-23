/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var TopHairfiesStore = require('../../stores/TopHairfiesStore');
var lodash = require('lodash');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [TopHairfiesStore]
    },
    getStateFromStores: function () {
        var hairfies = this.getStore(TopHairfiesStore).get(this.props.numTopHairfies);
        return {
            hairfies   : hairfies
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
                <h2>Les Hairfies du moment</h2>
                <div className="row">
                    <div className="col-xs-6 small-hairfies">
                        <div className="row">
                            {lodash.map(this.state.hairfies.slice(1, 5), function(h){ return this.renderHairfie(h, null)}, this)}
                        </div>
                    </div>

                    {this.renderHairfie(this.state.hairfies[0], 'big')}
                </div>
                <a href="#" className="btn btn-red home-cta col-md-3 col-xs-10">Plus de Hairfies</a>
            </section>
        );
    },
    renderHairfie: function (hairfie, customClass) {
        var pictureUrl = lodash.last(hairfie.pictures).url;
        var priceNode;
        if(hairfie.price) priceNode = <div className="pricetag">{hairfie.price.amount}{hairfie.price.currency == "EUR" ? "€" : ""}</div>;
        var hairfieClass = customClass ? "col-xs-6 " + customClass : "col-xs-6";

        var displayBusinessName = hairfie.business ? hairfie.business.name : null;
        var displayBusinessAddress = hairfie.business ? hairfie.business.address.street + ' ' + hairfie.business.address.city : null;

        return (
            <div className={hairfieClass}>
                <figure>
                    <img src={pictureUrl} />
                    <figcaption>
                        <NavLink routeName="show_hairfie" navParams={{hairfieId: hairfie.id}} context={this.props.context}>
                            {displayBusinessName}
                        </NavLink>
                        <NavLink className="address" routeName="show_hairfie" navParams={{hairfieId: hairfie.id}} context={this.props.context}>
                            {displayBusinessAddress}
                        </NavLink>
                        {priceNode}
                    </figcaption>
                </figure>
            </div>
        );
    }
});