'use strict';

var React = require ('react');
var _ = require ('lodash');
var moment = require('moment');
var Link = require('../Link.jsx');

var AddToCalendarButton =  React.createClass({
    getInitialState: function() {
        return {displayCalendars: false}
    },
    render: function() {
        return (
            <div>
                <a role="button" onClick={this.handleDisplayCalendars} {...this.props}>{this.props.children}</a>
                {this.renderCalendars()}
            </div>
        );
    },
    renderCalendars: function() {
        if (!this.state.displayCalendars) return;
        return (
            <div className="calendarPanel">
                {this.renderGoogleCalendar()}
                {this.renderYahooCalendar()}
                {this.renderOutlookCalendar()}
                {this.renderIcalsCalendar()}
            </div>
        );
    },
    renderGoogleCalendar: function() {
        var date = this._formatTime(moment(this.props.date).toDate()) + '/' + this._calculateEndTime(this.props.date, this.props.duration);

        var href = encodeURI([
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        '&text=' + (this.props.eventTitle || ''),
        '&dates=' + (date || ''),
        '&details=' + (this.props.description || ''),
        '&location=' + (this.props.address || ''),
        '&sprop=&sprop=name:'
        ].join(''));

        return (
            <Link href={href} target="_blank">
                {this.props.googleText || 'Ajouter au calendrier Google'}
            </Link>
        );
    },
    renderYahooCalendar: function() {
        var yahooHourDuration = this.props.duration < 600 ?
        '0' + Math.floor((this.props.duration / 60)) :
        Math.floor((this.props.duration / 60)) + '';

        var yahooMinuteDuration = this.props.duration % 60 < 10 ?
        '0' + this.props.duration % 60 :
        this.props.duration % 60 + '';

        var yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

        var st = this._formatTime(moment(moment(this.props.date).toDate().getTime() - (moment(this.props.date).toDate().getTimezoneOffset() * 60000)).toDate()) || '';

        var href = encodeURI([
            'http://calendar.yahoo.com/?v=60&view=d&type=20',
            '&title=' + (this.props.eventTitle || ''),
            '&st=' + st,
            '&dur=' + (yahooEventDuration || ''),
            '&desc=' + (this.props.description || ''),
            '&in_loc=' + (this.props.address || '')
        ].join(''));

        return (
            <Link href={href} target="_blank">
                {this.props.yahooText || 'Ajouter au calendrier Yahoo'}
            </Link>
        );
    },
    renderOutlookCalendar: function() {
        var startTime = this._formatTime(moment(this.props.date).toDate());
        var endTime = this._calculateEndTime(this.props.date, this.props.duration);

        var href = encodeURI(
        'data:text/calendar;charset=utf8,' + [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + document.URL,
          'DTSTART:' + (startTime || ''),
          'DTEND:' + (endTime || ''),
          'SUMMARY:' + (this.props.eventTitle || ''),
          'DESCRIPTION:' + (this.props.description || ''),
          'LOCATION:' + (this.props.address || ''),
          'END:VEVENT',
          'END:VCALENDAR'].join('\n'));

        return (
            <Link target="_blank" href={href}>
                {this.props.outlookText || 'Ajouter au calendrier Outlook'}
            </Link>
        );
    },
    renderIcalsCalendar: function() {
        var startTime = this._formatTime(moment(this.props.date).toDate());
        var endTime = this._calculateEndTime(this.props.date, this.props.duration);

        var href = encodeURI(
        'data:text/calendar;charset=utf8,' + [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + document.URL,
          'DTSTART:' + (startTime || ''),
          'DTEND:' + (endTime || ''),
          'SUMMARY:' + (this.props.eventTitle || ''),
          'DESCRIPTION:' + (this.props.description || ''),
          'LOCATION:' + (this.props.address || ''),
          'END:VEVENT',
          'END:VCALENDAR'].join('\n'));

        return (
            <Link target="_blank" href={href}>
                {this.props.icalsText || 'Ajouter au calendrier ICals'}
            </Link>
        );
    },
    handleDisplayCalendars: function() {
        this.setState({displayCalendars: !this.state.displayCalendars});
    },
    _calculateEndTime: function(startTime, duration) {
        return this._formatTime(moment(moment(startTime).toDate().getTime() + (duration * 60000)).toDate());
    },
    _formatTime: function(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }
});

module.exports = AddToCalendarButton;