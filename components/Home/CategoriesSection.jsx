'use strict';

var React = require('react');
var _ = require('lodash');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    getInitialState: function () {
        return {
            showAll: false
        };
    },
    render: function () {
        var categories = this.state.showAll ? this.props.categories : _.take(this.props.categories, 8);

        return (
            <section className="home-section categories" id="categories" ref="categories">
                <h2>Choisissez votre style</h2>
                <p className="subtitle">Pas encore décidé(e) ? Venez trouver votre style parmis des milliers de photos de coupes, couleurs et coiffures. Sombré, broux, carré wavy, coupe pixie, barbe… Faites défiler les hairfies et suivez les tendances.</p>
                <div className="section-content-1">
                    {_.map(_.chunk(categories, 4), this.renderCategoriesRow)}
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
        var query = '';

        if (this.props.tags) {
            query = _.compact(_.map(cat.tags, function(tagId) {
                try {
                    return _.find(this.props.tags, {id: tagId}).name;
                } catch(e) {
                    return;
                }
            }.bind(this)));
        }
        return (
            <div className="col-sm-3 col-xs-12" key={cat.id} >
                <figure>
                    <Picture picture={cat.picture} backgroundStyle={true} />
                    <figcaption>
                        <Link route="hairfie_search" params={{ address: 'Paris--France' }} query={{ tags: query }}>
                            <span className={/\s/.test(cat.label) ? '' : 'oneline'} dangerouslySetInnerHTML={{__html: cat.label.split(' ').join('<br />')}} />
                        </Link>
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
