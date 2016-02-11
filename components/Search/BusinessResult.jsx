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
var Loading = require('../Partial/Loading.jsx');
var ReactFitText = require('react-fittext');

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
                <Link className="btn btn-book full" route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                    Prendre RDV
                </Link>
            );
        }
        if (searchedCategories) {
            searchedCategoriesLabels = _.filter(searchedCategories, function(cat) {
                return _.includes(business.categories, cat.id)
            }, this);
            searchedCategoriesLabels = _.map(searchedCategoriesLabels, function(cat){return <span className="business-label hidden-xs">{cat.label}</span>});
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
                    <div className="business-name">
                        <Link route="business" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug}}>
                            <h3>{business.name}</h3>
                        </Link>
                    </div>
                    <ReactFitText compressor={1.55} maxFontSize={14}>
                        <div className="business-address">
                            {business.address.street + ', ' + business.address.zipCode + ' ' + business.address.city}    
                        </div>
                    </ReactFitText>
                    <div className="business-reviews">
                        {this.renderRating()}
                        <div className="clearfix" />
                    </div>
                    <div className="business-price-rating">
                        {this.renderPricing()}
                    </div>
                    <div className="business-promo">
                        {this.renderDiscount()}
                    </div>
                    {searchedCategoriesLabels}
                    <div className="book">
                        {booking_button}
                        <span className="hidden-xs">{this.renderAllHairfiesButton()}</span>
                    </div>
                </div>
            </section>
        );
    },
    renderAllHairfiesButton: function () {
        if (this.props.business.numHairfies == 0) return null;
        return (
            <Link className="btn btn-hairfies" route="business_hairfies" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>
                {'Voir les hairfies (' + this.props.business.numHairfies + ')'}
            </Link>
        );
    },
    renderRating: function () {
        if (!this.props.business.numReviews && !this.props.business.yelpObject) return;
        else if (this.props.business.numReviews) {
            var query  = this.props.date ? { date: this.props.date } : {};

            return (
                <Link route="business_reviews" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }} query={query}>
                    <span className="desktop">
                        <Rating rating={this.props.business.rating} min={true} />
                        {' - ' + this.props.business.numReviews + ' avis'}
                    </span>
                    <span className="mobile">
                        <Rating rating={this.props.business.rating} min={true} />{' (' + this.props.business.numReviews + ')'}
                    </span>
                </Link>
            );
        } else if (this.props.business.yelpObject.review_count > 0) {
            return (
                <Link route="business_reviews" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>
                    <img src={this.props.business.yelpObject.rating_img_url_large} alt="yelp" />{' (' + this.props.business.yelpObject.review_count + ')'}
                    <Picture picture={{url: "/img/search/yelp.png"}} className="visible-xs yelp"/>
                    <Picture picture={{url: "/img/search/yelp_review.png"}} style={{marginLeft: '5px'}} className="hidden-xs"/>
                </Link>
            );
        }
    },
    renderPricing: function () {
            return (
                <div>
                    <PriceRating business={this.props.business} />
                    {this.renderNumHairfies()}
                </div>
            );
    },
    renderDiscount: function () {
        if (!this.props.business.bestDiscount) return null;
        return (
            <div className="inline-promo">
                <span className="icon-promo">%</span>
                {'-' + this.props.business.bestDiscount + '% dans tout le salon*'}
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
        if (!this.props.result) return <Loading />;;

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
