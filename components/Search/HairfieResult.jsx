'use strict'

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Link = require('../Link.jsx');
var Pagination = require('./Pagination.jsx');
var SearchUtils = require('../../lib/search-utils');
var NavToLink = require('../mixins/NavToLink.jsx');

var Hairfie = React.createClass({
    mixins: [NavToLink],
    render: function () {
        return (
            <div className="col-xs-6 col-md-3 single-hairfie">
                <figure>
                    <Link route="hairfie" params={{ hairfieId: this.props.hairfie.id }}>
                        <Picture picture={_.last(this.props.hairfie.pictures)} options={{
                            width: 350,
                            height: 350,
                            crop: 'thumb'
                        }} />
                    </Link>
                    <figcaption onClick={this.openHairfie}>
                        {this.renderPrice()}
                    </figcaption>
                </figure>
            </div>
        );
    },
    renderPrice: function () {
        if (!this.props.hairfie.price) return;

        return <div className="pricetag">{this.props.hairfie.price.amount+'€'}</div>;
    },
    openHairfie: function (e) {
        e.preventDefault();
        this.navToLink('hairfie', { hairfieId: this.props.hairfie.id });
    }
});

var HairfieResult = React.createClass({
    render: function () {
        if (!this.props.result) return <div className="loading" />;
        if (this.props.result.numHits == 0) return this.renderNoResult();

        return (
            <div className="tab-pane active">
                <section>
                    <div className="salon-hairfies hairfies">
                        <div className="row">
                            {_.map(this.props.result.hits, function (hairfie) {
                                return <Hairfie key={hairfie.id} hairfie={hairfie} />;
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
