/** @jsx React.DOM */

var React = require('react');
var Layout = require('./PublicLayout.jsx');
var Business = require('./BusinessPage');
var connectToStores = require('fluxible/addons/connectToStores');

var BusinessPage = React.createClass({
    componentDidMount: function () {
        TweenMax.to('#content.salon .main-content', 0.5, {top:0,opacity:1,ease:Power2.easeIn});
    },
    render: function () {
        var business = this.props.business || {};

        return (
            <Layout context={this.props.context}>
                <Business.Carousel pictures={business.pictures} />
                <div className="container salon" id="content">
                    <div className="main-content col-md-8 col-sm-12" style={{opacity: 1, top: '0px'}}>
                        <Business.ShortInfos business={business} />
                        <section className="salon-content">
                            <div className="row">
                                <div role="tabpannel">
                                    <div className="row">
                                        <ul className="nav nav-tabs" role="tablist">
                                            <li role="presentation" className="col-xs-4 active">
                                                <a href="#informations" aria-controls="informations" role="tab" data-toggle="tab">
                                                    <span className="icon-nav"></span>
                                                    Informations
                                                </a>
                                            </li>
                                            <li role="presentation" className="col-xs-4">
                                                <a href="#reviews" aria-controls="reviews" role="tab" data-toggle="tab">
                                                    <span className="icon-nav"></span>
                                                    Avis
                                                </a>
                                            </li>
                                            <li role="presentation" className="col-xs-4">
                                                <a href="#hairfies" aria-controls="hairfies" role="tab" data-toggle="tab">
                                                    <span className="icon-nav"></span>
                                                    Hairfies
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content">
                                        <div role="tabpannel" className="tab-pane fade active in" id="informations">
                                            <Business.InformationsTab
                                                context={this.props.context}
                                                business={this.props.business}
                                                services={this.props.services}
                                                discounts={this.props.discounts}
                                                stations={this.props.stations}
                                                />
                                        </div>
                                        <div role="tabpannel" className="tab-pane fade" id="reviews">
                                            <Business.ReviewsTab
                                                context={this.props.context}
                                                reviews={this.props.reviews}
                                                />
                                        </div>
                                        <div role="tabpannel" className="tab-pane fade" id="hairfies">
                                            <Business.HairfiesTab context={this.props.context} businessId={this.props.route.params.businessId} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <Business.Sidebar context={this.props.context} businessId={this.props.route.params.businessId} />
                </div>
                <div className="row"></div>
            </Layout>
        );
    }
});

BusinessPage = connectToStores(BusinessPage, [
    require('../stores/BusinessStore'),
    require('../stores/BusinessServiceStore'),
    require('../stores/BusinessReviewStore'),
    require('../stores/StationStore')
], function (stores, props) {
    var business = stores.BusinessStore.getById(props.route.params.businessId);

    return {
        business: business,
        services: stores.BusinessServiceStore.getByBusiness(props.route.params.businessId),
        discounts: stores.BusinessStore.getDiscountForBusiness(props.route.params.businessId),
        stations: business && stores.StationStore.getByLocation(business.gps),
        reviews: stores.BusinessReviewStore.getLatestByBusiness(props.route.params.businessId, 50)
    };
});

module.exports = BusinessPage;
