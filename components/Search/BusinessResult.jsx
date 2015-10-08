'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Pagination = require('./Pagination.jsx');
var Picture = require('../Partial/Picture.jsx');
var HairfieActions = require('../../actions/HairfieActions');
var SearchUtils = require('../../lib/search-utils');

var Hairfies = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    componentDidMount: function () {
        if (!this.props.business.topHairfies && typeof window != 'undefined') {
            this.context.executeAction(HairfieActions.loadBusinessTopHairfies, this.props.business.id);
        }
    },
    render: function () {
        return (
            <div className="salon-hairfies">
                <ul>
                    {_.map(_.take(this.props.business.topHairfies, 6), this.renderHairfie)}
                    {this.renderMore()}
                </ul>
            </div>
        );
    },
    renderHairfie: function (hairfie, i) {
        var className = i > 2 ? 'hidden-xs' : '';
        if (i > 4) className = className+' hidden-md hidden-sm';

        return (
            <li key={hairfie.id} className={className}>
                <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                    <Picture picture={_.last(hairfie.pictures)}
                             options={{width: 55, height: 55}}
                          placeholder="/img/placeholder-55.png"
                                 alt="" />
                </Link>
            </li>
        );
    },
    renderMore: function () {
        if ((this.props.business.topHairfies || []).length < 6) return;
        return (
            <li className="more">
                <Link route="business" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug}}>
                    <Picture picture={{url: "/img/placeholder-hairfie-thumb-more.png"}} alt="" />
                </Link>
            </li>
        );
    }
});

var Business = React.createClass({
    propTypes: {
        business: React.PropTypes.object.isRequired
    },
    render: function () {
        var booking_button = null;
        if (this.props.business.isBookable)
            booking_button = (
                <Link className="btn btn-book full" route="business_booking" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>
                    Prendre RDV
                </Link>
            );

        return (
            <section className="col-xs-12">
                <div className="col-xs-12 col-sm-4 image-bloc">
                    <Link route="business" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>
                        <Picture
                            picture={_.first(this.props.business.pictures)}
                            options={{ width: 400, height: 400, crop: 'thumb' }}
                            placeholder="/img/placeholder-640.png"
                            />
                     </Link>
                </div>
                <div className="col-xs-12 col-sm-8 info-bloc">
                    <div className="address-bloc">
                        <h3>
                            <Link route="business" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>
                                {this.props.business.name}
                            </Link>
                        </h3>
                        <Link className="address" route="business" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>
                            {this.props.business.address.street}, {this.props.business.address.zipCode} {this.props.business.address.city}
                        </Link>
                    </div>
                    {this.renderPricing()}
                    <Hairfies business={this.props.business} />
                    <div className="book">
                        {booking_button}
                    </div>
                    {this.renderRating()}
                    <div className="clearfix"></div>
                </div>
            </section>
        );
    },
    renderRating: function () {
        if (!this.props.business.numReviews) return;

        var rating = (this.props.business.rating / 10).toPrecision(2);
        var query  = this.props.date ? { date: this.props.date } : {};

        return (
            <div className="rating">
                <div className="note">
                    <span>{rating}</span>/10
                </div>
                <Link className="small" route="business" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }} query={query}>
                    {this.props.business.numReviews} avis
                </Link>
            </div>
        );
    },
    renderPricing: function () {
        if (this.props.business.bestDiscount) {
            return (
                <p className="inline-promo">
                    <span className="icon-promo">%</span>
                    -{this.props.business.bestDiscount}% dans tout le salon*
                    {this.renderAveragePrice()}
                </p>
            );
        }

        return (
            <p className="inline-promo">
                &nbsp;
                {this.renderAveragePrice()}
            </p>
        );
    },
    renderAveragePrice: function () {
        var price = this.props.business.averagePrice || {},
            men   = price.men && Math.round(price.men),
            women = price.women && Math.round(price.women);

        if (men && women) {
            return <span className="black">Prix moyen homme {men}€ / femme {women}€</span>;
        } else if (men) {
            return <span className="black">Prix moyen homme {men}€</span>;
        } else if (women) {
            return <span className="black">Prix moyen femme {women}€</span>;
        }
    }
});

var BusinessResult = React.createClass({
    render: function () {
        if (!this.props.result) return <div className="loading" />;

        var result = this.props.result;
        var date   = this.props.search && this.props.search.date;

        if (result.hits.length == 0) return this.renderNoResult();

        return (
            <div className="tab-pane active" id="salons">
                <div className="row">
                    {_.map(result.hits, function (business) {
                        return <Business key={business.id} business={business} date={date} />
                    }, this)}
                </div>
                {this.renderPagination()}
            </div>
        );
    },
    renderPagination: function () {
        var params = SearchUtils.searchToRouteParams(this.props.search);

        return <Pagination
            numPages={this.props.result.nbPages}
            currentPage={this.props.search.page}
            route="business_search"
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

module.exports = BusinessResult;
