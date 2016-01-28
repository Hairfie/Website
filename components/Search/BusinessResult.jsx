'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var PriceRating = require('../Partial/PriceRating.jsx');
var Pagination = require('./Pagination.jsx');
var Picture = require('../Partial/Picture.jsx');
var BusinessActions = require('../../actions/BusinessActions');
var HairfieActions = require('../../actions/HairfieActions');
var SearchUtils = require('../../lib/search-utils');
var Rating = require('../Partial/Rating.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');

var Hairfies = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    componentDidMount: function () {
        if (!this.props.business.topHairfies && typeof window != 'undefined') {
            // FIXME LATER
            // this.context.executeAction(HairfieActions.loadBusinessTopHairfies, { businessId: this.props.business.id });
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
    mixins: [NavToLinkMixin],
    render: function () {
        var booking_button = null;
        var business = this.props.business;
        var searchedCategories = this.props.searchedCategories;
        var promo_icon = null;
        var searchedCategoriesLabels = null;
        /**
        * best discount over picture for mobile
        */
        if (business.bestDiscount) {
            promo_icon = (
                    <i className="visible-xs icon-promo">{business.bestDiscount + ' %'}</i>
                );
        }
        if (business.isBookable) {
            booking_button = (
                <Link className="btn btn-book col-sm-12 full" route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                    Prendre RDV
                </Link>
            );
        }
        if (searchedCategories) {
            searchedCategoriesLabels = _.filter(searchedCategories, function(cat) {
                return _.includes(business.categories, cat.id)}, this);
            searchedCategoriesLabels = _.map(searchedCategoriesLabels, 'label');
        }
        return (
            <section className="row business-result" onClick={this.navToLink.bind(this, "business", {businessId: business.id, businessSlug: business.slug}, null)}>
                <div className="image-bloc">
                        <Picture
                            picture={_.first(business.pictures)}
                            className="hidden-xs"
                            options={{ width: 220, height: 220, crop: 'thumb' }}
                            placeholder="/img/placeholder-220.png"
                            alt={business.pictures.length > 0 ? business.name : ""}
                            />
                         <Picture
                            picture={_.first(business.pictures)}
                            className="visible-xs"
                            options={{ width: 100, height: 124, crop: 'thumb' }}
                            placeholder="/img/placeholder-124.png"
                            alt={business.pictures.length > 0 ? business.name : ""}
                            />
                        {promo_icon}
                </div>
                <div className="info-bloc">
                    <div className="address-bloc">
                        <div className="main-infos">
                            <h3>
                                <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                                    {business.name}
                                </Link>
                            </h3>
                            <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                                {business.address.street}, {business.address.zipCode} {business.address.city}
                            </Link>
                        </div>
                        {this.renderRating()}
                        <div className="clearfix"></div>
                    </div>
                    {this.renderPricing()}
                    {searchedCategoriesLabels}
                    <div className="book">
                        {booking_button}
                    </div>
                    <div className="clearfix"></div>
                </div>
            </section>
        );
    },
    renderRating: function () {
        if (!this.props.business.numReviews) return;
        var query  = this.props.date ? { date: this.props.date } : {};

        return (
            <div className="rating">
                <div className="note">
                    <Link route="business_reviews" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }} query={query}>
                        <Rating rating={this.props.business.rating} min={true} className="interactive" />
                    </Link>
                </div>
                <Link className="pull-right" route="business_reviews" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }} query={query}>
                    <span className="visible-xs">-&nbsp;</span>{this.props.business.numReviews +' avis'}
                </Link>
                <div className="clearfix"></div>
            </div>
        );
    },
    renderPricing: function () {
        var bestDiscountNode;
        if (this.props.business.bestDiscount) {
            bestDiscountNode = (<div className="inline-promo">
                        <span className="icon-promo">%</span>
                        {'-' + this.props.business.bestDiscount + '% dans tout le salon*'}
                    </div>);
        }
            return (
                <div>
                    {bestDiscountNode}
                    <PriceRating business={this.props.business} />
                    {this.renderNumHairfies()}
                </div>
            );
    },
    renderNumHairfies: function () {
        if (this.props.business.numHairfies) {
            return (
                <p>
                    <span className="visible-xs numHairfies"><i className="hairfie-icon" />{this.props.business.numHairfies + ' Hairfies'}</span>
                </p>
            );
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
                        return <Business key={business.id} business={business} date={date} searchedCategories={this.props.searchedCategories}/>
                    }, this)}
                </div>
                {this.renderPagination()}
            </div>
        );
    },
    submit: function () {
        var search = {
            address : this.props.search.address,
            q       : this.props.search.address.q
        };

        this.context.executeAction(BusinessActions.submitSearch, search);
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
