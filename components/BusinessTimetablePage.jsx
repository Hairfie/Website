/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var Layout = require('./ProLayout.jsx');
var _ = require('lodash');

var Weekdays = require('../constants/DateTimeConstants').Weekdays;

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var dayOfWeekRows = _.map(_.values(Weekdays), this.renderWeekday);

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Timetable</h2>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Day of week</th>
                            <th>Opening hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dayOfWeekRows}
                    </tbody>
                </table>
            </Layout>
        );
    },
    renderWeekday: function (weekday) {
        var business    = this.state.business,
            timetable   = business.timetable || {},
            timeWindows = timetable[weekday] || [];

        return (
            <tr key={weekday}>
                <td>{weekday}</td>
                <td>
                    {this.renderTimeWindows(timeWindows)}
                </td>
            </tr>
        );
    },
    renderTimeWindows: function (timeWindows) {
        if (0 == timeWindows.length) {
            return <em>Closed</em>
        }

        var timeWindowNodes = timeWindows.map(this.renderTimeWindow);

        return (
            <ul className="list-group">
                {timeWindowNodes}
            </ul>
        );
    },
    renderTimeWindow: function (timeWindow) {
        return (
            <li className="list-group-item">
                {timeWindow.startTime} - {timeWindow.endTime}
            </li>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
