'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var moment = require('moment');
var DateTimeConstants = require('../../constants/DateTimeConstants');

moment.locale('fr');

var Rating = React.createClass({
    render: function () {
        var business = this.props.business || {};
        if (!business.numReviews) return <span />;

        var rating = Math.round(business.rating / 100 * 5);

        return (
            <div className="stars">
                {_.map([1, 2, 3, 4, 5], function (starValue) {
                    return <span className={'star'+(starValue <= rating ? ' full' : '')} />
                })}
                <Link route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className="avis">
                    {business.numReviews+' avis'}
                </Link>
            </div>
        );
    }
});

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
        var today = DateTimeConstants.weekDaysNumber[moment().day()];

        var displayAddress = _.isEmpty(address) ? null : address.street + ', ' + address.zipCode + ', ' + address.city + '.';
        var linkToMap = _.isEmpty(address) ? null : <div onClick={function() {$('html,body').animate({ scrollTop: $("#location").offset().top}, 'slow');}}><Link route="business" params={{ businessId: business.id, businessSlug: business.slug }} fragment="location" className="linkToMap" preserveScrollPosition={true}>(Voir la carte)</Link></div>;
        var open;

        if (this.props.business.timetable) {
          if (_.isEmpty(this.props.business.timetable[today]))
            open = <a className="red" role="button" onClick={this.handleDisplayTimetable}>Fermé aujourd'hui</a>;
          else
            open = <a className="green" role="button" onClick={this.handleDisplayTimetable}>Ouvert aujourd'hui</a>;
      }
        return (
            <section className="salon-info">
              <div className="row">
                <div className="col-sm-8">
                  <h1>{business.name}</h1>
                  <h2>Horaires d'ouverture: {open}</h2>
                  <div className="visible-xs">
                    {this.renderTimetable()}
                  </div>
                  <h2>{displayAddress} {linkToMap}</h2>
                  {this.renderAveragePrice()}
                </div>
                <div className="col-sm-4" style={{padding: '0'}}>
                  <Rating business={business} />
                  <div className="hidden-xs">
                    {this.renderTimetable()}
                  </div>
                </div>
              </div>
              <div className="row" style={{paddingBottom: '20px'}}>
                <div className="prix col-xs-12 col-sm-12">
                </div>
                {/*
                <div className="horraires col-xs-12 col-sm-6">
                  <p>
                    <span className="green glyphicon glyphicon-time"></span>
                    <span className="green opened">Ouvert Aujourd'hui</span>
                    <span className="red closed hide">Fermé Aujourd'hui</span>
                    <span>&nbsp;-&nbsp;<a href="" className="small">voir les détails</a></span>
                  </p>
                </div>
                */}
              </div>
              {/*
              <div className="row">
                <div className="tags col-xs-12">
                  <p>Spécialités :
                  <a href="#" className="tag">Femme</a>
                  <a href="#" className="tag">Femme</a>
                  <a href="#" className="tag">Femme</a>
                  <a href="#" className="tag">Femme</a></p>
                </div>
              </div>
              <div className="row social">
                <div className="twitter col-sm-4 col-xs-6">
                  <a href="#" className="btn twitter"><span className="socicon">a</span> Partager sur Twitter</a>
                </div>
                <div className="facebook col-sm-4 col-xs-6">
                  <a href="#" className="btn facebook"><span className="socicon">b</span> Partager sur Facebook</a>
                </div>
              </div>
              */}
          </section>
        );
    },
    renderAveragePrice: function () {
        var price = this.props.business && this.props.business.averagePrice || {};

        if (!price.men && !price.women) return;

        return (
            <p>
                <span className="glyphicon glyphicon-euro"></span>
                {price.men ? 'Homme ' : ''}
                {price.men ? <span>&nbsp;{Math.round(price.men)}€</span> : ''}
                {price.men && price.women ? <span>&nbsp;-&nbsp;</span> : ''}
                {price.women ? 'Femme' : ''}
                {price.women ? <span>&nbsp;{Math.round(price.women)}€</span> : ''}
            </p>
        );
    },
    handleDisplayTimetable: function() {
      this.setState({displayTimetable: (!this.state.displayTimetable)});
    },
    renderTimetable: function() {
      if (!this.state.displayTimetable || !this.props.business.timetable)
        return;
      var timetable = this.props.business.timetable;
      var render = [];
      _.forEach(DateTimeConstants.weekDaysNumberFR, function(val) {
        render.push(
        <div>
          <span className="extra-small col-xs-2 col-sm-4">{DateTimeConstants.weekDayLabel(val)} : </span>{
            _.isEmpty(timetable[val]) ? <span className="red">Fermé</span> : _.map(timetable[val], function(t) {
              return t.startTime + ' - ' + t.endTime;
            }).join(" / ")
          }
        </div>);
      });
      return (
      <div className="timetable">
        {render}
      </div>);
    }
});
