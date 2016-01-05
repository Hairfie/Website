'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var PriceRating = require('../Partial/PriceRating.jsx');
var moment = require('moment');
var DateTimeConstants = require('../../constants/DateTimeConstants');
var parseTimetable = require('../../lib/time').parseTimetable;
var businessAccountTypes = require('../../constants/BusinessAccountTypes');
moment.locale('fr');

var ShareButton = React.createClass({
    componentDidMount: function () {
        new window.Share('.share-business', {
            ui: {
              button_text: "Partager",
              },
            networks: {
              pinterest: {
                enabled: false
                }
              }
        });
    },
    render: function () {
        return (
              <div style={{dispay: 'inline-block'}}>
                <div className="share-business">
                </div>
              </div>
            );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
      return {
        displayTimetable: false
      };
    },
    render: function () {
        var business = this.props.business || {};
        var address  = business.address || {};
        var timetable = business.timetable || {};

        var today = DateTimeConstants.weekDaysNumber[moment().day()];


        var displayAddress = _.isEmpty(address) ? null : address.street + ', ' + address.zipCode + ', ' + address.city + '.';
        var displayProfilePicture = (business.profilePicture && business.accountType != businessAccountTypes.FREE);
        return (
            <section className="salon-info">
              <div className="row">
                <div className={"col-sm-8" + (displayProfilePicture ? " profilePicture" : "")}>
                  <h2>{displayAddress}</h2>
                  <div className="horaires">
                    <a role="button" onClick={this.handleDisplayTimetable}>
                      <p className="title">
                        {timetable[today] && !_.isEmpty(timetable[today]) ? 'OUVERT' : 'FERMÉ'}
                      </p>
                      <span className="today">
                        {DateTimeConstants.weekDayLabel(today) + (_.isEmpty(timetable[today]) ? '' : ' : ' + _.map(parseTimetable(timetable[today]), function(t) {
                            return t.startTime + ' - ' + t.endTime;
                        }).join(" / ") + ' >')}
                      </span>
                    </a>
                    <div className="visible-xs">
                      {this.renderTimetable()}
                    </div>
                  </div>
                  <PriceRating business={business} />
                </div>
                <div className="col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-3 avis" style={{padding: '0', marginTop: '-5px'}}>
                  <Link className="btn" route="write_business_review" query={{businessId: this.props.business.id}}>DÉPOSEZ UN AVIS</Link>
                  <div className="hidden-xs">
                    {this.renderTimetable()}
                  </div>
                </div>
              </div>
              <div className="row" style={{paddingBottom: '20px'}}>
                <div className="prix col-xs-12 col-sm-12">
                </div>
              </div>
          </section>
        );
    },
    handleDisplayTimetable: function() {
      this.setState({displayTimetable: (!this.state.displayTimetable)});
    },
    renderTimetable: function() {
        if (!this.props.business.timetable)
            return;

        var timetable = this.props.business.timetable;
        var render = [];
        render = _.map(DateTimeConstants.weekDaysNumberFR, function(val, i) {
            return (
                <div className={this.state.displayTimetable ? '' : 'seo-hide'} key={i}>
                    <span className="extra-small col-xs-2 col-sm-4">{DateTimeConstants.weekDayLabel(val)} : </span>
                    { _.isEmpty(timetable[val]) ? <span className="red">Fermé</span> : _.map(parseTimetable(timetable[val]), function(t) {
                            return t.startTime + ' - ' + t.endTime;
                        }).join(" / ") }
                </div>
            );
        }, this);
      return (
          <div className="timetable">
              {render}
          </div>
      );
    }
});
