'use strict';

var React = require('react');
var _ = require('lodash');

var ParentLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var Carousel = require('../Partial/Carousel.jsx');
var ShortInfos = require('./ShortInfos.jsx');
var Sidebar = require('./Sidebar.jsx');
var GlobalReviews = require('./GlobalReviews.jsx');
var Rating = require('./Rating.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Picture = require('../Partial/Picture.jsx');
var businessAccountTypes = require('../../constants/BusinessAccountTypes');

var TabContent = React.createClass({
    render: function() {
        return (
            <div className={"full-tab " + this.props.extraClass}>
                <span><i className="icon-nav"/>{this.props.label}</span>
            </div>
        );
    }
});

var BusinessTab = React.createClass({
    renderReviewTabContent: function() {
        var business = this.props.business;
        if (business.numReviews && !business.shouldDisplayYelp) return (<TabContent label={business.numReviews + ' Avis'} extraClass="icon-avis" />);
        else if (!business.numReviews && business.shouldDisplayYelp) return (<TabContent label={business.yelpObject.review_count + ' Avis'} extraClass="icon-yelp"/>);
        else if (business.numReviews && business.shouldDisplayYelp){
            return (
                <div className="full-tab reviews-tab">
                    <TabContent label={business.numReviews +' Avis'} extraClass="semi-tab icon-avis" />
                    <TabContent label={business.yelpObject.review_count + ' Avis'} extraClass="semi-tab icon-yelp" />
                    <div className="bottom-tab">
                        <span>
                            {(business.numReviews+business.yelpObject.review_count) + ' Avis'}
                        </span>
                    </div>
                </div>
            );
        } else return (<TabContent label='Avis' extraClass="icon-avis" />);
    },
    render: function () {
        var route;
        var content;
        var numHairfies = this.props.business.numHairfies > 0 ? this.props.business.numHairfies : null;
        switch(this.props.tab) {
            case 'infos':
                route = 'business';
                content = <TabContent label="infos" extraClass="icon-info" />;
                break;
            case 'reviews':
                route = 'business_reviews';
                content = this.renderReviewTabContent();
                break;
            case 'hairfies':
                route = 'business_hairfies';
                content = <TabContent label={numHairfies ? numHairfies + ' Hairfies' : 'Hairfies'} extraClass="icon-hairfie" />;
                break;
        }
        return (
            <li className={'col-xs-4' + (this.props.active ? ' active' : '')}>
                <Link route={route} params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }} preserveScrollPosition={true}>
                    {content}
                </Link>
            </li>
        );
    }
});

var Layout = React.createClass({
    render: function () {
        if (!this.props.business) {
            return <ParentLayout />
        }

        var business = this.props.business;
        var displayProfilePicture = (business.profilePicture && business.accountType != businessAccountTypes.FREE);
        var numHairfies = business.numHairfies > 0 ? business.numHairfies : null;

        return (
            <ParentLayout>
                <div className={"salon " + (business.accountType && business.accountType.toLowerCase())} id="content">
                    <div id="carousel-salon">
                    <Carousel id="carousel-salon" className={_.isEmpty(business.pictures) ? "noPicture" : ""} backgroundStyle={true} gallery={true} backgroundProps="linear-gradient(transparent, rgba(0,0,0,0.4)),"  pictures={business.pictures} alt={business.name + ' | Hairfie'}/>
                        <div className="carousel-info container">
                            <div className="col-xs-12" style={{padding: '0'}}>
                                <div className={"col-xs-12 name" + (displayProfilePicture ? " profilePicture" : "")}>
                                    <h1>{business.name}</h1>
                                    <GlobalReviews business={business} className="global-reviews mobile" />
                                </div>
                            </div>
                            {
                                displayProfilePicture ?
                                    <Picture picture={business.profilePicture} 
                                         options={{
                                            width: 340,
                                            height: 340,
                                            crop: 'thumb',
                                            gravity: 'faces'
                                         }}
                                        placeholder="/img/placeholder-640.png" 
                                        className="profil-picture"/>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="container">
                        <div className="main-content col-md-8 col-sm-12">
                            <ShortInfos business={business} />
                            <section id="salon-content" className="salon-content">
                                <div className="row">
                                    <div role="tabpannel">
                                        <div className="row">
                                            <ul className="nav nav-tabs" role="tablist">
                                                <BusinessTab tab="infos" active={'infos' === this.props.tab} business={business} />
                                                <BusinessTab tab="reviews" active={'reviews' === this.props.tab} business={business} />
                                                <BusinessTab tab="hairfies" active={'hairfies' === this.props.tab} business={business} />
                                            </ul>
                                        </div>
                                        <div className="tab-content">
                                            <div role="tabpannel" className="tab-pane active">
                                                {this.props.children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <Sidebar
                            business={this.props.business}
                            similarBusinesses={this.props.similarBusinesses}
                            tab={this.props.tab}
                            />
                    </div>
                </div>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: this.getSchema()}} />
            </ParentLayout>
        );
    },
    getSchema: function() {
        var business = this.props.business;
        var metas = this.props.metas;
        var description = _.find(metas, {property: 'description'}) || _.find(metas, {name: 'description'}) || {};

        var markup = {
          "@context": "http://schema.org",
          "@type": "HairSalon",
          "name": business.name,
          "url": this.props.canonicalUrl,
          "description": description.content
        };

        if(business.numReviews > 0 || (business.yelpObject && business.yelpObject.review_count > 0)) {
            var numReviews = business.numReviews + business.review_count;
            var rating, numReviews;
            if(business.rating) {
                rating = business.rating/100*5;
                numReviews = business.numReviews;
            } else if (business.yelpObject.review_count ) {
                rating = business.yelpObject.rating;
                numReviews = business.yelpObject.review_count;
            }

            markup["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": numReviews
            }
        }

        return JSON.stringify(markup);
    }
});

Layout = connectToStores(Layout, [
    'BusinessStore',
    'MetaStore'
], function (context, props) {
    return {
        similarBusinesses: props.business && props.business.crossSell && context.getStore('BusinessStore').getSimilar(props.business.id),
        metas: context.getStore('MetaStore').getMetas(),
        canonicalUrl: context.getStore('MetaStore').getCanonicalUrl()
    };
});

module.exports = Layout;
