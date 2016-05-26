'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var PriceRating = require('../Partial/PriceRating.jsx');
var GlobalReviews = require('./GlobalReviews.jsx');
var moment = require('moment');
var DateTimeConstants = require('../../constants/DateTimeConstants');
var parseTimetable = require('../../lib/time').parseTimetable;
var businessAccountTypes = require('../../constants/BusinessAccountTypes');
var Breadcrumb = require('../Partial/Breadcrumb.jsx');
var classNames = require('classnames');
var PhoneButton = require('./PhoneButton.jsx');
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

        var displayAddress = _.isEmpty(address) ? null : address.street + ', ' + address.zipCode + ', ' + address.city + '.';
        var displayProfilePicture = (business.profilePicture && business.accountType != businessAccountTypes.FREE);
        var btnRDVClass = classNames({
            'btn btn-book btn-book-inside': true,
            'visible-xs': business.isBookable,
            'hidden': !business.isBookable
        });
        var btnPhoneClass = classNames ({
            'hidden-md hidden-lg' : true,
            'hidden' : (business.isBookable && business.displayPhoneNumber),
            'visible-xs visible-sm': !business.isBookable
        });

        return (
            <section className={"salon-info" + (this.state.displayTimetable ? ' open-timetable' : '')}>
                <div className="row">
                    <div className={"col-sm-8 short-infos" + (displayProfilePicture ? " profilePicture" : "")}>
                        <p className="address">{displayAddress}</p>
                        <div className="horaires">
                            {this.displayTimeTableTitle()}
                            <div className={(this.state.displayTimetable ? 'visible-xs' : 'hide')}>
                                {this.renderTimetable()}
                            </div>
                        </div>
                        <PriceRating business={business} className="price-rating" />
                        <Link className="btn btn-review" route="write_business_review" query={{businessId: this.props.business.id}}>
                            <i className="icon-white-star" />
                            Déposer un avis
                        </Link>
                    </div>
                    <GlobalReviews business={business} className="global-reviews hidden-xs desktop pull-right" />
                    <div className="clearfix" />
                </div>
                <Breadcrumb business={business} />
                <hr className="visible-xs" />
                <Link className={btnRDVClass} route="business_booking" params={{ businessId: business.id, businessSlug: business.slug }}>
                    Prendre RDV
                </Link>
                <div className={btnPhoneClass}>
                    <PhoneButton business={this.props.business} />
                </div>
          </section>
        );
    },
    handleDisplayTimetable: function() {
      this.setState({displayTimetable: (!this.state.displayTimetable)});
    },
    displayTimeTableTitle: function() {
        var timetable = this.props.business.timetable || {};
        var today = DateTimeConstants.weekDaysNumber[moment().day()];

        if(_.isEmpty(timetable) || _.isEmpty(_.flattenDeep(_.values(timetable)))) {
            return <div className="more empty"><span>Pas d'infos sur les horaires</span></div>;
        }

        var todayTimetable;
        if(!_.isEmpty(timetable[today])) {
            todayTimetable = _.map(parseTimetable(timetable[today]), function(t) {
                return t.startTime + ' à ' + t.endTime;
            }).join(" et de "); 
        }

        var displayTitle;
        if(timetable[today] && !_.isEmpty(timetable[today])) {
            displayTitle = <span className="title green">{"Ouvert de " + todayTimetable}</span>
        } else {
            displayTitle = <span className="title color-hairfie">Fermé aujourd'hui</span>
        }

        return (
            <a role="button" onClick={this.handleDisplayTimetable}>
                <div>
                    {displayTitle}
                    <span className="more">{' - Voir le détail >'}</span>
                </div> 
                <div className={"hidden-xs" + (this.state.displayTimetable ? '' : ' hide')}>
                {this.renderTimetable()}
                </div>
            </a>
        );
    },
    renderTimetable: function() {
        if (!this.props.business.timetable)
            return;

        var timetable = this.props.business.timetable;
        var render = [];
        render = _.map(DateTimeConstants.weekDaysNumberFR, function(val, i) {
            return (
                <div className={this.state.displayTimetable ? '' : 'seo-hide'} key={i}>
                    <span className="extra-small col-xs-2 col-sm-5">{DateTimeConstants.weekDayLabelFR(val) + " :"}</span>
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
