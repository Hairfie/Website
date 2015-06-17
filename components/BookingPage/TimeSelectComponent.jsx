'use strict';

var React = require('react'),
    moment = require('moment');

var _ = require('lodash');

var DateTimeConstants = require('../../constants/DateTimeConstants');
var weekDaysNumber = DateTimeConstants.weekDaysNumber;
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;

var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    propTypes: {
        onTimeSlotChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onTimeSlotChange: _.noop
        };
    },
    getInitialState: function() {
        var today = new Date();
        return {
            timeslotSelected: this.props.timeslotSelected
        };
    },

    render: function() {
        if(!this.props.daySelected) {
            return (<p>Commencez par choisir un jour</p>);
        }
        var daySelected = this.props.daySelected,
            timetable = this.props.timetable,
            timetableSelected = timetable[weekDaysNumber[daySelected.day()]],
            hours = [],
            discounts = [];

         _.forEach(timetableSelected, function(slot) {
            var start = moment(daySelected).hours(slot.startTime.split(":")[0]).minutes(slot.startTime.split(":")[1]),
                stop  = moment(daySelected).hours(slot.endTime.split(":")[0]).minutes(slot.endTime.split(":")[1]).add(-1, 'hour');

            moment().range(start, stop).by('hours', function(hour) {
                hours.push({hour: hour, discount: slot.discount});
            });
        });

        var rowHours = [], rowLength = 4;

        while (hours.length > 0)
            rowHours.push(hours.splice(0, rowLength));

        return (
            <div className="time-table">
                <table className="cal">
                    <tr>
                        { _.map(rowHours, this.renderRow, this) }
                    </tr>
                </table>
            </div>
        );

    },
    renderRow: function(rowHours) {
        return (
            <div>{ _.map(rowHours, this.renderTimeButton, this) }</div>
        );
    },
    renderTimeButton: function(timeBtnObj) {
        var timeslot = timeBtnObj.hour,
            discount = timeBtnObj.discount,
            label = timeslot.format("HH:mm"),
            discountNode;

        var cls = 'btn timeslot';
            cls += timeslot.isSame(this.state.timeslotSelected) ? ' active' : '';

        if(discount) {
            discountNode = (<span className="promo-day">{discount}%</span>);
        }

        return <td className={cls} onClick={this.timeSlotCallback.bind(null, timeslot, discount)}><a href="#"><p>{label}</p>{discountNode}</a>
            </td>;
    },
    timeSlotCallback: function(timeslot, discount, e) {
        e.preventDefault();
        this.setState({ timeslotSelected: timeslot});
        this.props.onTimeSlotChange(timeslot, discount);
    }
});
