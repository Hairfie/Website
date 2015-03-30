'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../../stores/BusinessStore');
var Calendar = require('../Form/BookingCalendarComponent.jsx');
var NavLink = require('flux-router-component').NavLink;
var SimilarBusinesses = require('./SimilarBusinesses.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');

module.exports = React.createClass({
    mixins: [FluxibleMixin, NavToLinkMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function (props) {
        var props = props || this.props;

        return {
            business: this.getStore(BusinessStore).getById(props.businessId)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    render: function () {
        return (
            <div className="sidebar col-sm-4">
                {this.renderCalendar()}
                {this.renderBookNow()}
                {this.renderSimilarBusinesses()}
            </div>
        );
    },
    renderCalendar: function () {
        var business = this.state.business || {};

        return (
            <div className="calendar hidden-xs">
                <Calendar ref="calendar" timetable={business.timetable} />
            </div>
        );
    },
    renderBookNow: function () {
        var business = this.state.business;

        if (!business) return;

        return (
            <div className="promo-sidebar">
                {this.renderBestDiscount()}
                <NavLink
                    className="btn btn-red hidden-xs"
                    context={this.props.context}
                    routeName="book_business"
                    navParams={{businessId: business.id, businessSlug: business.slug}}
                    onClick={this.book}>
                    Réserver maintenant
                </NavLink>
            </div>
        );
    },
    renderBestDiscount: function () {
        var discount = this.state.business && this.state.business.bestDiscount;

        if (!discount) return;

        return (
            <p className="inline-promo">
                <span className="icon-promo">%</span>
                &nbsp;{discount}% dans tout le salon*
            </p>
        );
    },
    renderSimilarBusinesses: function () {
        var crossSell = this.state.business && this.state.business.crossSell;
        if (!crossSell) return;

        return <SimilarBusinesses context={this.props.context} businessId={this.props.businessId} />;
    },
    book: function (e) {
        e.preventDefault();

        var business = this.state.business || {};
        var pathParams = {businessId: business.id, businessSlug: business.slug};
        var queryParams = {date: this.refs.calendar.getDate()};

        this.navToLink('book_business', pathParams, queryParams);
    }
});
