'use strict';

var React = require('react');
var moment = require('moment');
var connectToStores = require('fluxible-addons-react/connectToStores');
var TimeslotsActions = require('../../actions/TimeslotsActions');

moment.locale('fr')

var _ = require('lodash');

require('moment-range');

var BookingCalendarComponent = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
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
        var state = {
            month: this.props.defaultDate || moment().format("YYYY-MM-DD"),
            selectedDate: this.props.defaultDate,
            timeslots: this.props.timeslots
        };
        this.context.executeAction(TimeslotsActions.loadBusinessTimeslots, {
            from: moment(state.month, "YYYY-MM-DD").startOf("month").startOf("week").format('YYYY-MM-DD'),
            until: moment(state.month, "YYYY-MM-DD").endOf("month").endOf("week").format('YYYY-MM-DD'),
            id: this.props.businessId
        });
        return state;
    },
    prevMonth: function(ev) {
        this.loadMonth(-1);
        this.setState({
            month: moment(this.state.month).add(-1, 'months').format("YYYY-MM-DD")
        });
    },
    nextMonth: function(ev) {
        this.loadMonth(1);
        this.setState({
            month: moment(this.state.month).add(1, 'months').format("YYYY-MM-DD")
        });
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.timeslots && this.state.timeslots != nextProps.timeslots) {
            this.setState({timeslots: nextProps.timeslots});
        }
        if (nextProps.defaultDate && this.props.defaultDate != nextProps.defaultDate) {
            this.setState({
                month: nextProps.defaultDate,
                selectedDate: nextProps.defaultDate
            });
        }
    },
    render: function() {
        var start = moment(this.state.month, "YYYY-MM-DD").startOf("M").startOf("W");
        var m = moment(this.state.month, "YYYY-MM-DD");
        var stop = moment(this.state.month, "YYYY-MM-DD").endOf("M").endOf("W");
        var i;

        var month = [];

        moment().range(start, stop).by('weeks', function(w) {
            var week = [];
            moment().range(w, moment(w).endOf('isoWeek')).by('days', function(d) {
                week.push(d);
            });
            month.push(week);
        });
        return (
            <div className="calendar">
                <table className="cal">
                    <caption>
                        <span className="prev" onClick={this.prevMonth}><a role="button"></a></span>
                        <span className="next" onClick={this.nextMonth}><a role="button"></a></span>
                        {m.format('MMMM YYYY')}
                    </caption>
                    <thead>
                        <tr>
                            <th>Lun</th>
                            <th>Mar</th>
                            <th>Mer</th>
                            <th>Jeu</th>
                            <th>Ven</th>
                            <th>Sam</th>
                            <th>Dim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {month.map(this.renderWeekRow)}
                    </tbody>
                </table>
            </div>
        );
    },
    renderWeekRow: function(w) {
        return (
            <tr key={w[0].get('week')}>
                { _.map(w, this.renderDay, this) }
            </tr>
        );
    },
    renderDay: function(d) {
        var date = moment(d).format("YYYY-MM-DD");
        var timeslots = this.state.timeslots ? this.state.timeslots[date] : null;
        var cls = '';

        var cls = (date == moment().format("YYYY-MM-DD")) ? 'today' : '';

        if (this.state.selectedDate && this.state.selectedDate == date)
            cls += ' active';

        var isOpen, discount, discountNode;
        if (timeslots && timeslots.length > 0) {
            isOpen = true;
            _.each(timeslots, function(timewindow) {
                if(timewindow.discount) {
                    if(!discount) {
                        discount = timewindow.discount;
                    } else {
                        discount = timewindow.discount > discount ? timewindow.discount : discount;
                    }
                }
            });
            if(discount) {
                discountNode = (<span className="promo-day">{discount}%</span>);
                cls += ' discount';
            }
        }
        else {
            isOpen = false;
        }

        if(isOpen) {
            cls += ' bookable'
            return <td className={cls} key={d.get('date')} onClick={this.dayCallback.bind(this, d.format('YYYY-MM-DD'))}><a role="button">{discountNode}{d.get('date')}</a></td>;
        }
        else {
            cls += ' off';
            if (this.state.selectedDate && d.isSame(this.state.selectedDate, 'day')) cls.replace("active", "");
            return <td className={cls} key={d.get('date')}>{ d.get('date') }</td>;
        }

    },
    dayCallback: function(d, e) {
        e.preventDefault();
        this.setState({selectedDate: d}, this.props.onDayChange.bind(null, d));
    },
    getDate: function () {
        return this.state.selectedDate;
    },
    loadMonth: function (n) {
        this.context.executeAction(TimeslotsActions.loadBusinessTimeslots, {
            from: moment(this.state.month, "YYYY-MM-DD").add(n, 'months').startOf("month").startOf("week").format('YYYY-MM-DD'),
            until: moment(this.state.month, "YYYY-MM-DD").add(n, 'months').endOf("month").endOf("week").format('YYYY-MM-DD'),
            id: this.props.businessId
        });
    }
});

var BookingCalendarComponent = connectToStores(BookingCalendarComponent, [
    'TimeslotsStore'
], function (context, props) {
    return {
        timeslots : context.getStore('TimeslotsStore').getById(props.businessId)
    }
});

module.exports = BookingCalendarComponent;