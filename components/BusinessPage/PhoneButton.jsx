'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var ga = require('../../services/analytics');
var businessAccountTypes = require('../../constants/BusinessAccountTypes');
var _ = require('lodash');
var classNames = require('classnames');

var Sidebar = React.createClass({
    getInitialState: function () {
        return {
            displayPhone: false
        };
    },
    render: function() {
        var business = this.props.business;
        console.log(business.accountType);
        if(business.accountType != businessAccountTypes.PREMIUM && !business.displayPhoneNumber) return null;

        var link = null;
        if (this.state.displayPhone) {
            link = (<a href={"tel:" + business.phoneNumber.replace(/ /g,"")} className="btn btn-phone">
                {business.phoneNumber}
            </a>);
        }
        else {
            link = (<a role="button" className="btn btn-phone" onClick={this.trackCall}>
                {this.state.displayPhone ? business.phoneNumber : "Afficher le numéro"}
            </a>);
        }

        return (
            <div className="phone">
                {link}
            </div>
        );
    },
    trackCall: function(e) {
        e.preventDefault();
        if(ga) {
            var eventAction = 'call';
            if(this.props.business.accountType == 'BASIC') eventAction += ' BASIC';
            if(this.props.business.accountType == 'FREE') eventAction += ' FREE';

            ga('send', {
              hitType: 'event',
              eventCategory: 'Call Booking',
              eventAction: eventAction,
              eventLabel: this.props.business.name
            });
        }
        this.setState({displayPhone: true});
    }
});


module.exports = Sidebar;