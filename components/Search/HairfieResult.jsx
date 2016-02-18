'use strict'

var React = require('react');
var _ = require('lodash');
var Pagination = require('./Pagination.jsx');
var SearchUtils = require('../../lib/search-utils');
var Hairfie = require('../Partial/Hairfie.jsx');
var Newsletter = require('../Partial/Newsletter.jsx');
var Loading = require('../Partial/Loading.jsx');


var HairfieResult = React.createClass({
    render: function () {
        if (!this.props.result) return <Loading />;
        // OLD Newsletter
        //<div className="hairfie-search-newsletter">
        //    <Newsletter />
        //</div>
        var searchedCategories = this.props.searchedCategories;
        var searchedCategoriesLabels;
        if (searchedCategories) {
            searchedCategoriesLabels = _.map(searchedCategories, function(cat) {
                return (
                    <span key={cat} className="business-label" onClick={this.removeCategory.bind(this, cat)}>{cat}&times;</span>
                );
            }, this)
        }

        if (this.props.result.numHits == 0) return this.renderNoResult(searchedCategoriesLabels);

        return (
            <div className="tab-pane active">

                <section>
                    <div>
                        {searchedCategoriesLabels}
                    </div>
                    <div className="salon-hairfies hairfies">
                        <div className="row">
                            {_.map(this.props.result.hits, function (hairfie) {
                                return <Hairfie className="col-xs-6 col-md-3 single-hairfie" key={hairfie.id} hairfie={hairfie} popup={true} hairfies={_.map(this.props.result.hits, 'id')} />;
                            }.bind(this))}
                        </div>
                    </div>
                    {this.renderPagination()}
                </section>
            </div>
        );
    },
    renderPagination: function () {
        var numPages = Math.ceil(this.props.result.numHits / 16);
        var params = SearchUtils.searchToRouteParams(this.props.search);

        return <Pagination
            numPages={numPages}
            currentPage={this.props.search.page}
            route="hairfie_search"
            params={params.path}
            query={params.query}
            />
    },
    renderNoResult: function (searchedCategoriesLabels) {
        return (
            <div className="tab-pane active" id="salons">
                <div className="row">
                    {searchedCategoriesLabels}
                </div>
                <div className="row">
                    <p className="text-center">
                        Aucun résultat correspondant à votre recherche n'a pu être trouvé.
                        <br />
                        Essayez de retirer un filtre ou d'étendre votre recherche géographique pour obtenir plus de résultats !
                    </p>
                </div>
            </div>
        );
    },
    removeCategory: function (category) {
        this.props.onChange({tags: _.without(this.props.search.tags, category)});
    }
});

module.exports = HairfieResult;
