'use strict';

var React = require('react');
var _ = require('lodash');

var ParentLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var Carousel = require('../Partial/Carousel.jsx');
var ShortInfos = require('./ShortInfos.jsx');
var Sidebar = require('./Sidebar.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Breadcrumb = require('./Breadcrumb.jsx');
var Picture = require('../Partial/Picture.jsx');
var businessAccountTypes = require('../../constants/BusinessAccountTypes');

var Rating = React.createClass({
    render: function () {
        var business = this.props.business || {};
        if (!business.numReviews) return <span />;

        var rating = Math.round(business.rating / 100 * 5);

        return (
            <div className="stars">
                {_.map([1, 2, 3, 4, 5], function (starValue) {
                    return <Link key={starValue} route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className={'star'+(starValue <= rating ? ' full' : '')} />
                })}
                <Link route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className="avis hidden-xs hidden-md">
                    {business.numReviews+' avis'}
                </Link>
            </div>
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

        return (
            <ParentLayout>
                <div className={"salon " + (business.accountType && business.accountType.toLowerCase())} id="content">
                    <Breadcrumb business={business} />
                    <div id="carousel-salon">
                    <Carousel id="carousel-salon" backgroundStyle={true} gallery={true} backgroundProps="linear-gradient(transparent, rgba(0,0,0,0.4)),"  pictures={business.pictures} alt={business.name + ' | Hairfie'}/>
                        <div className="carousel-info container">
                            <div className={"col-sm-12 col-md-8" + (displayProfilePicture ? " profilePicture" : "")} style={{overflow: 'auto', padding: '0'}}>
                                <div className="col-xs-8">
                                    <h1>{business.name}</h1>
                                </div>
                                <div className="col-xs-4">
                                    <Rating business={business} />
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
                                        placeholder="/img/placeholder-640.png" />
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
                                                <li className={'col-xs-4'+('infos' === this.props.tab ? ' active' : '')}>
                                                    <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }} preserveScrollPosition={true}>
                                                        <span className="icon-nav"></span>
                                                        Informations
                                                    </Link>
                                                </li>
                                                <li className={'col-xs-4'+('reviews' === this.props.tab ? ' active' : '')}>
                                                    <Link route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} preserveScrollPosition={true}>
                                                        <span className="icon-nav"></span>
                                                        Avis
                                                    </Link>
                                                </li>
                                                <li className={'col-xs-4'+('hairfies' === this.props.tab ? ' active' : '')}>
                                                    <Link route="business_hairfies" params={{ businessId: business.id, businessSlug: business.slug }} preserveScrollPosition={true}>
                                                        <span className="icon-nav"></span>
                                                        Hairfies
                                                    </Link>
                                                </li>
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

        if(business.numReviews > 0) {
            markup["aggregateRating"] ={
                "@type": "AggregateRating",
                "ratingValue": business.rating/100*5,
                "reviewCount": business.numReviews
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
