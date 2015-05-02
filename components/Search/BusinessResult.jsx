'use strict';

var React = require('react');
var _ = require('lodash');
var NavLink = require('flux-router-component').NavLink;
var Pagination = require('./Pagination.jsx');
var Picture = require('../Partial/Picture.jsx');
var HairfieActions = require('../../actions/HairfieActions');
var SearchUtils = require('../../lib/search-utils');

var BusinessLink = React.createClass({
    render: function () {
        var navParams = {
            businessId  : this.props.business.id,
            businessSlug: this.props.business.slug
        };

        return <NavLink {...this.props} routeName="business" navParams={navParams} />;
    }
});

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
                <NavLink routeName="hairfie" navParams={{hairfieId: hairfie.id}}>
                    <Picture picture={_.last(hairfie.pictures)}
                             options={{width: 55, height: 55}}
                          placeholder="/images/placeholder-55.png"
                                 alt="" />
                </NavLink>
            </li>
        );
    },
    renderMore: function () {
        if ((this.props.hairfies || []).length < 6) return;

        return (
            <li className="more">
                <BusinessLink business={this.props.business}>
                    <img src="/images/placeholder-hairfie-thumb-more.png" alt="" />
                </BusinessLink>
            </li>
        );
    }
});

var Business = React.createClass({
    propTypes: {
        business: React.PropTypes.object.isRequired
    },
    contextTypes: {
        makeUrl: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <section className="col-xs-12">
                <div className="col-xs-12 col-sm-4 image-bloc">
                    <BusinessLink business={this.props.business}>
                        <Picture
                            picture={_.first(this.props.business.pictures)}
                            options={{width: 400, height: 400, crop: 'thumb'}}
                            placeholder="/images/placeholder-640.png"
                            />
                     </BusinessLink>
                </div>
                <div className="col-xs-12 col-sm-8 info-bloc">
                    <div className="address-bloc">
                        <h3>
                            <BusinessLink business={this.props.business}>
                                {this.props.business.name}
                            </BusinessLink>
                        </h3>
                        <BusinessLink business={this.props.business} className="address">
                            {this.props.business.address.street}, {this.props.business.address.zipCode} {this.props.business.address.city}
                        </BusinessLink>
                    </div>
                    {this.renderPricing()}
                    <Hairfies business={this.props.business} />
                    <NavLink href={this.makeBookingHref()} className="btn btn-red">
                        Réserver
                    </NavLink>
                    {this.renderRating()}
                </div>
            </section>
        );
    },
    renderPicture: function (picture, alt) {
        if (!picture) return;

        return <img src={picture.url} alt={alt} />
    },
    renderRating: function () {
        if (!this.props.business.numReviews) return;

        var rating = (this.props.business.rating / 10).toPrecision(2);

        return (
            <div className="rating">
                <div className="note">
                    <span>{rating}</span>/10
                </div>
                <BusinessLink business={this.props.business} className="small">
                    {this.props.business.numReviews} avis
                </BusinessLink>
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
            return <span className="black">&nbsp;&nbsp;prix moyen homme {men}€ / femme {women}€</span>;
        } else if (men) {
            return <span className="black">&nbsp;&nbsp;prix moyen homme {men}€</span>;
        } else if (women) {
            return <span className="black">&nbsp;&nbsp;prix moyen femme {women}€</span>;
        }
    },
    makeBookingHref: function () {
        var query = {};
        if (this.props.date) query.date = this.props.date;

        return this.context.makeUrl('business_booking', {
            businessId: this.props.business.id,
            businessSlug: this.props.business.slug
        }, query);
    }
});

var BusinessResult = React.createClass({
    render: function () {
        if (!this.props.result) return <div className="loading" />;

        var result = this.props.result;
        var date   = this.props.search && this.props.search.date;

        if (result.hits.length == 0) return this.renderNoResult();

        return (
            <div className="tab-pane active">
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
            routeName="business_search"
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

module.exports = BusinessResult;
