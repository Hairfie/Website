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
var Input = require('react-bootstrap/Input');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');

var TimePicker = React.createClass({
    render: function () {
        return <Input ref="input" {...this.props} type="time" />;
    },
    getValue: function () {
        return this.refs.input.getValue();
    }
});

var NewTimeWindowModal = React.createClass({
    render: function () {
        var dayOfWeekNodes = _.map(_.values(Weekdays), function (wd) {
            return (
                <li key={wd}>
                    <label>
                        <input type="checkbox" ref={wd} /> {weekDayLabel(wd)}
                    </label>
                </li>
            );
        }, this);

        return (
            <Modal {...this.props} title="Ajout d'une heure d'ouverture">
                <div className="modal-body">
                    <Row>
                        <Col xs={3}>
                            <TimePicker ref="startTime" label="Heure de début" />
                        </Col>
                        <Col xs={3}>
                            <TimePicker ref="endTime" label="Heure de fin" />
                        </Col>
                        <Col xs={6}>
                            <Input ref="discount" type="select" label="Promotion" defaultValue="">
                                <option value="">Pas de promotion</option>
                                <option value="20">-20%</option>
                                <option value="30">-30%</option>
                                <option value="40">-40%</option>
                                <option value="50">-50%</option>
                            </Input>
                        </Col>
                    </Row>
                    <Input label="Jour(s) de la semaine">
                        <ul className="list-unstyled">
                            {dayOfWeekNodes}
                        </ul>
                    </Input>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.save}>Ajouter</Button>
                </div>
            </Modal>
        );
    },
    save: function () {
        var timeWindow  = {
                startTime   : this.refs.startTime.getValue(),
                endTime     : this.refs.endTime.getValue(),
        };
        if(this.refs.discount.getValue()) {
            timeWindow.discount = this.refs.discount.getValue();
        }
        this.props.handleSave({
            timeWindow  : timeWindow,
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
                <h2>Horaires</h2>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Jour de la semaine</th>
                            <th>Heures d'ouverture</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dayOfWeekRows}
                    </tbody>
                </table>

                <ModalTrigger modal={newTimeWindowModal} container={this}>
                    <Button onClick={this.openAddForm}>Ajouter une heure d'ouverture</Button>
                </ModalTrigger>
            </Layout>
        );
    },
    renderWeekday: function (weekday) {
        var business    = this.state.business || {},
            timetable   = business.timetable || {},
            timeWindows = timetable[weekday] || [];

        return (
            <tr key={weekday}>
                <td>{weekDayLabel(weekday)}</td>
                <td>
                    {this.renderTimeWindows(weekday, timeWindows)}
                </td>
            </tr>
        );
    },
    renderTimeWindows: function (weekday, timeWindows) {
        if (0 == timeWindows.length) {
            return <em>Fermé</em>
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

        var discount = timeWindow.discount ? ' - Promotion : -'+timeWindow.discount + '% ' : null;

        return (
            <li key={index+'-'+start+'-'+end} className="list-group-item">
                {timeWindow.startTime} - {timeWindow.endTime}
                {discount}
                <Button bsSize="xsmall" className="pull-right" onClick={remove}>
                    Supprimer
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

/**
 * @TODO: remove me!
 */
function weekDayLabel(wd) {
    return ({
        MON: 'Lundi',
        TUE: 'Mardi',
        WED: 'Mercredi',
        THU: 'Jeudi',
        FRI: 'Vendredi',
        SAT: 'Samedi',
        SUN: 'Dimanche'
    })[wd];
}
