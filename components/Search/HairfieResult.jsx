'use strict'

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var NavLink = require('flux-router-component').NavLink;
var Pagination = require('./Pagination.jsx');
var SearchUtils = require('../../lib/search-utils');

var Hairfie = React.createClass({
    contextTypes: {
        makeUrl: React.PropTypes.func.isRequired,
        navigateTo: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div className="col-xs-6 col-md-3 single-hairfie">
                <figure>
                    <NavLink href={this.getHairfieUrl()}>
                        <Picture picture={_.last(this.props.hairfie.pictures)} options={{
                            width: 350,
                            height: 350,
                            crop: 'thumb'
                        }} />
                    </NavLink>
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
        this.context.navigateTo(this.getHairfieUrl());
    },
    getHairfieUrl: function () {
        return this.context.makeUrl('show_hairfie', {hairfieId: this.props.hairfie.id});
    }
});

var HairfieResult = React.createClass({
    render: function () {
        if (!this.props.result) return <div className="loading" />;
        if (this.props.result.numHits == 0) return this.renderNoResult();

        return (
            <div className="tab-pane active">
                <section>
                    <h3>Les Hairfies</h3>
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
        var numPages = Math.ceil(this.props.result.numHits / 12);
        var params = SearchUtils.searchToRouteParams(this.props.search);

        return <Pagination
            numPages={numPages}
            currentPage={this.props.search.page}
            routeName="hairfie_search_result"
            pathParams={params.path}
            queryParams={params.query}
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
