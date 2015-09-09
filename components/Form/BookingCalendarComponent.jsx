'use strict';

var React = require('react'),
    moment = require('moment');

moment.locale('fr')

var _ = require('lodash');

require('moment-range');

var weekDaysNumber = require('../../constants/DateTimeConstants').weekDaysNumber;

module.exports = React.createClass({
    propTypes: {
        defaultDate : React.PropTypes.string,
        onDayChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onDayChange: _.noop
        };
    },
    getInitialState: function() {
        return {
            month: moment(this.props.defaultDate, "YYYY-MM-DD").month() || moment().month(),
            selectedDate: this.props.defaultDate;
            timeslots: this.props.timeslots
        };
    },
    prevMonth: function(ev) {
        this.setState({
            month: moment(this.state.month).add(-1, 'months').month()
        });
    },
    nextMonth: function(ev) {
        this.setState({
            month: moment(this.state.month).add(1, 'months').month()
        });
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.state.timeslots != nextProps.timeslots) {
            this.setState({timeslots: nextProps.timeslots});
        }
        if (this.props.defaultDate != nextProps.defaultDate) {
            this.setState({
                month: moment(nextProps.defaultDate, "YYYY-MM-DD").month(),
                selectedDate: this.nextProps.defaultDate;
            });
        }
    },
    render: function() {
        var start = moment().month(this.state.month).startOf("M").startOf("W");
        var stop = moment().month(this.state.month).startOf("M").startOf("W");
    },
    renderMonth: function() {

    },
    renderWeek: function() {

    },
    renderDay: function() {

    }

});