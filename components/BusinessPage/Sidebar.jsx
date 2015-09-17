'use strict';

var React = require('react');
var Calendar = require('../Form/BookingCalendarComponent.jsx');
var Link = require('../Link.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var SimilarBusinesses = require('./SimilarBusinesses.jsx');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <div className="sidebar col-sm-4">
                {this.renderCalendar()}
                {this.renderBookNow()}
                {this.renderPhoneNumber()}
                {this.renderSimilarBusinesses()}
            </div>
        );
    },
    renderCalendar: function () {
        var business = this.props.business || {};
        if (!business.isBookable) return;

        return (
            <div className="calendar">
                <Calendar ref="calendar" businessId={business.id} onDayChange={this.book} />
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
    if (business.isBookable && !business.displayPhoneNumber)
        return;
        return (
                <div className="phone">
                    <a href={"tel:" + business.phoneNumber.replace(/ /g,"")} className="btn btn-red">
                        {business.phoneNumber}
                    </a>
                </div>
            );
    },
    renderSimilarBusinesses: function () {
        if (!this.props.similarBusinesses) return;

        return <SimilarBusinesses businesses={this.props.similarBusinesses} />;
    },
    book: function (date) {
        var business = this.props.business || {};
        var pathParams = {businessId: business.id, businessSlug: business.slug};
        var queryParams = {date: date};

        this.navToLink('business_booking', pathParams, queryParams);
    }
});
