/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var CategoryStore = require('../../stores/CategoryStore');
var _ = require('lodash');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    mixins: [FluxibleMixin, NavToLinkMixin],
    statics: {
        storeListeners: [CategoryStore]
    },
    getStateFromStores: function () {
        return {
            categories : this.getStore(CategoryStore).all()
        };
    },
    getInitialState: function () {
        return _.assign(this.getStateFromStores(), {
            showAll: false
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        var categories = this.state.categories || [];

        if (!this.state.showAll) categories = categories.slice(0, 6);

        return (
            <section className="home-section">
                <h2>Vous cherchez de l'inspiration ?</h2>
                <div className="section-content-1">
                    {_.map(_.chunk(categories, 3), function (categories) {
                        return (
                            <div key={_.pluck(categories, 'id').join('|')} className="row">
                                {_.map(categories, this.renderCategory)}
                            </div>
                        );
                    }, this)}
                </div>
                <a href="#" onClick={this.toggleShowAll} className="btn btn-red home-cta col-md-3 col-xs-10">
                    {this.state.showAll ? 'Moins' : 'Plus'} de catégories
                </a>
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
                            <span className="oneline">{cat.name}</span>
                        </NavLink>
                        <a href="#"><span>{cat.name}</span></a>
                    </figcaption>
                </figure>
            </div>
        );
    },
    toggleShowAll: function (e) {
        e.preventDefault();
        this.setState({showAll: !this.state.showAll});
    }
});
