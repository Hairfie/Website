/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var Layout = require('./ProLayout.jsx');
var _ = require('lodash');

var Weekdays = require('../constants/DateTimeConstants').Weekdays;

var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var Button = require('react-bootstrap/Button');

var TimePicker = React.createClass({
    render: function () {
        return <input ref="input" {...this.props} type="text" />
    },
    getValue: function () {
        return this.refs.input.getDOMNode().value;
    }
});

var NewTimeWindowModal = React.createClass({
    render: function () {
        var dayOfWeekNodes = _.map(_.values(Weekdays), function (wd) {
            return (
                <li key={wd}>
                    <label>
                        <input type="checkbox" ref={wd} /> {wd}
                    </label>
                </li>
            );
        }, this);

        return (
            <Modal {...this.props} title={"Add a time window"}>
                <div className="modal-body">
                    <h3>Time window</h3>
                    From
                    <TimePicker ref="startTime" />
                    to
                    <TimePicker ref="endTime" />

                    <h3>Days of week</h3>
                    <ul className="list-unstyled">
                        {dayOfWeekNodes}
                    </ul>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.save}>Add</Button>
                </div>
            </Modal>
        );
    },
    save: function () {
        this.props.handleSave({
            timeWindow  : {
                startTime   : this.refs.startTime.getValue(),
                endTime     : this.refs.endTime.getValue()
            },
            weekdays    : this._getSelectedWeekdays()
        });
        this.props.onRequestHide();
    },
    _getSelectedWeekdays: function () {
        return _.filter(_.values(Weekdays), function (wd) {
            return this.refs[wd].getDOMNode().checked;
        }, this);
    }
});

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

        var newTimeWindowModal = <NewTimeWindowModal container={this} handleSave={this.handleSaveNewTimeWindow} />

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

                <ModalTrigger modal={newTimeWindowModal} container={this}>
                    <button onClick={this.openAddForm}>Add time window</button>
                </ModalTrigger>
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
                    {this.renderTimeWindows(weekday, timeWindows)}
                </td>
            </tr>
        );
    },
    renderTimeWindows: function (weekday, timeWindows) {
        if (0 == timeWindows.length) {
            return <em>Closed</em>
        }

        var timeWindowNodes = timeWindows.map(this.renderTimeWindow.bind(this, weekday));

        return (
            <ul className="list-group">
                {timeWindowNodes}
            </ul>
        );
    },
    renderTimeWindow: function (weekDay, timeWindow, index) {
        var start   = timeWindow.startTime,
            end     = timeWindow.endTime,
            remove  = this.removeTimeWindow.bind(this, weekDay, start, end);

        return (
            <li key={index+'-'+start+'-'+end} className="list-group-item">
                {timeWindow.startTime} - {timeWindow.endTime}
                <Button className="pull-right" onClick={remove}>
                    remove
                </Button>
            </li>
        );
    },
    handleSaveNewTimeWindow: function (payload) {
        var timetable = _.cloneDeep(this.state.business.timetable || {});
        _.map(payload.weekdays, function (wd) {
            if (!timetable[wd]) timetable[wd] = [payload.timeWindow];
            else timetable[wd].push(payload.timeWindow);
        });

        this._saveTimetable(timetable);
    },
    removeTimeWindow: function (weekday, startTime, endTime) {
        console.log('remove', weekday, startTime, endTime);
        var timetable = _.cloneDeep(this.state.business.timetable || {});
        if (!timetable[weekday]) return;
        timetable[weekday] = _.filter(timetable[weekday], function (tw) {
            return tw.startTime != startTime || tw.endTime != endTime;
        });
        this._saveTimetable(timetable);
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    _saveTimetable: function (timetable) {
        // TODO: In most cases I prefer to save specific attributes only, should
        //       we rename the action or change the payload's structure?
        this.props.context.executeAction(BusinessActions.Save, {
            business: {
                id          : this.state.business.id,
                timetable   : timetable
            }
        });
    }
});
