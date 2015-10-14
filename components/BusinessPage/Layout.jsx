'use strict';

var React = require('react');
var ParentLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var Carousel = require('./Carousel.jsx');
var ShortInfos = require('./ShortInfos.jsx');
var Sidebar = require('./Sidebar.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');

var Layout = React.createClass({
    render: function () {
        if (!this.props.business) {
            return <ParentLayout />
        }

        var business = this.props.business;

        return (
            <ParentLayout>
                <Carousel pictures={business.pictures} />
                <div className="container salon" id="content">
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
            </ParentLayout>
        );
    }
});

Layout = connectToStores(Layout, [
    'BusinessStore'
], function (context, props) {
    return {
        similarBusinesses: props.business && props.business.crossSell && context.getStore('BusinessStore').getSimilar(props.business.id)
    };
});

module.exports = Layout;
