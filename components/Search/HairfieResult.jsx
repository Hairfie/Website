'use strict'

var React = require('react');
var _ = require('lodash');
var Pagination = require('./Pagination.jsx');
var SearchUtils = require('../../lib/search-utils');
var Hairfie = require('../Partial/Hairfie.jsx');
var Newsletter = require('../Partial/Newsletter.jsx');

var HairfieResult = React.createClass({
    render: function () {
        if (!this.props.result) return <div className="loading" />;
        if (this.props.result.numHits == 0) return this.renderNoResult();

        return (
            <div className="tab-pane active">
            <Newsletter />
                <section>
                    <div className="salon-hairfies hairfies">
                        <div className="row">
                            {_.map(this.props.result.hits, function (hairfie) {
                                return <Hairfie className="col-xs-6 col-md-3 single-hairfie" hairfie={hairfie} />;
                            })}
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
    renderNoResult: function () {
        return (
            <p className="text-center">
                <br />
                <br />
                Aucun résultat correspondant à votre recherche n'a pu être trouvé.
                <br />
                <br />
            </p>
        );
    }
});

module.exports = HairfieResult;
