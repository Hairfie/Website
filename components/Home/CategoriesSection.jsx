/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var NavLink = require('flux-router-component').NavLink;
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    contextTypes: {
        makeUrl: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            showAll: false
        };
    },
    render: function () {
        var categories = this.state.showAll ? this.props.categories : _.take(this.props.categories, 6);

        return (
            <section className="home-section">
                <h2>Vous cherchez de l'inspiration ?</h2>
                <div className="section-content-1">
                    {_.map(_.chunk(categories, 3), this.renderCategoriesRow)}
                </div>
                <a href="#" onClick={this.toggleShowAll} className="btn btn-red home-cta col-md-3 col-xs-10">
                    {this.state.showAll ? 'Moins' : 'Plus'} de catégories
                </a>
            </section>
        );
    },
    renderCategoriesRow: function (cats) {
        return (
            <div key={_.pluck(cats, 'id').join('')} className="row">
                {_.map(cats, this.renderCategory)}
            </div>
        );
    },
    renderCategory: function (cat) {
        var href = this.context.makeUrl('business_search_results', {address: "Paris--France"}, {categories: cat.name});

        return (
            <div className="col-sm-4 col-xs-12" key={cat.id} >
                <figure>
                    <Picture picture={cat.picture} alt={cat.name} />
                    <figcaption>
                        <NavLink href={href}>
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
