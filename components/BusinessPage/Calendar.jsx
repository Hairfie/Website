/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../../stores/BusinessStore');
var Calendar = require('../Form/BookingCalendarComponent.jsx');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
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
        var business = this.state.business || {};

        return (
            <div className="calendar hidden-xs">
                <Calendar onDayChange={this.book} timetable={business.timetable} />
            </div>
        );
    }
});
