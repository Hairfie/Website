'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var SimilarBusinesses = require('./SimilarBusinesses.jsx');
var ga = require('../../services/analytics');


module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <div className="sidebar col-sm-4">
                {this.renderBookNow()}
                {this.renderPhoneNumber()}
                {this.renderSimilarBusinesses()}
            </div>
        );
    },
    renderBookNow: function () {
        var business = this.props.business;
        if (!business || !business.isBookable) return;
        return (
                <div className="promo-sidebar">
                    {this.renderBestDiscount()}
                    <Link className="btn btn-book" route="business_booking" params={{ businessId: business.id, businessSlug: business.slug }}>
                        Prendre RDV
                    </Link>
                </div>
        );
    },
    renderBestDiscount: function () {
        var discount = this.props.business && this.props.business.bestDiscount;

        if (!discount) return;

        return (
            <p className="inline-promo">
                <span className="icon-promo">%</span>
                &nbsp;{discount}% dans tout le salon*
            </p>
        );
    },
    renderPhoneNumber: function() {
        var business = this.props.business;
        if(business.accountType == 'PREMIUM' || business.displayPhoneNumber) {
            return (
                <div className="phone">
                    <a href={"tel:" + business.phoneNumber.replace(/ /g,"")} className="btn btn-red" onClick={this.trackCall}>
                        {business.phoneNumber}
                    </a>
                </div>
            );
        } else {
            return;
        }
    },
    trackCall: function() {
        if(ga) {
            ga('send', {
              hitType: 'event',
              eventCategory: 'Call Booking',
              eventAction: 'call',
              eventLabel: this.props.business.name
            });
        }
    },
    renderSimilarBusinesses: function () {
        if (!this.props.similarBusinesses) return;
        if (this.props.business && this.props.business.accountType == 'PREMIUM') return;

        return <SimilarBusinesses businesses={this.props.similarBusinesses} slidebar={true} />;
    },
    book: function (date) {
        var business = this.props.business || {};
        var pathParams = {businessId: business.id, businessSlug: business.slug};
        var queryParams = {date: date};

        this.navToLink('business_booking', pathParams, queryParams);
    }
});
