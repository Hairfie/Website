/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var CategoriesStore = require('../../stores/CategoriesStore');
var lodash = require('lodash');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    mixins: [FluxibleMixin, NavToLinkMixin],
    statics: {
        storeListeners: [CategoriesStore]
    },
    getStateFromStores: function () {
        return {
            categories : this.getStore(CategoriesStore).get()
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
                <h2>Que recherchez-vous ?</h2>
                <div className="section-content-1">
                    <div className="row">
                        {lodash.map(this.state.categories, this.renderCategory).slice(0, 3)}
                    </div>
                    <div className="row">
                        {lodash.map(this.state.categories, this.renderCategory).slice(3, 6)}
                    </div>
                </div>
                <a href="#" className="btn btn-red home-cta col-md-3 col-xs-10">Plus de catégories</a>
            </section>
        );
    },
    renderCategory: function (cat) {
        var href = this.props.context.makeUrl('business_search_results', {address: "Paris--France"}, {categories: cat.name});

        return (
            <div className="col-sm-4 col-xs-12" key={cat.id} >
                <figure>
                    <img src={cat.picture.url} alt={cat.name} />
                    <figcaption>
                        <NavLink href={href} context={this.props.context}>
                            <span>{cat.name}</span>
                        </NavLink>
                        <a href="#"><span>{cat.name}</span></a>
                    </figcaption>
                </figure>
            </div>
        );
    }
});