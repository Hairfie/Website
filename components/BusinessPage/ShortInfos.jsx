'use strict';

var React = require('react');
var _ = require('lodash');

var Rating = React.createClass({
    render: function () {
        if (!this.props.numReviews) return <span />;

        var rating = Math.round(this.props.rating / 100 * 5);

        return (
            <div className="col-sm-4 stars">
                {_.map([1, 2, 3, 4, 5], function (starValue) {
                    return <span className={'star'+(starValue <= rating ? ' full' : '')} />
                })}
                <a href="#reviews" className="avis">{this.props.numReviews} avis</a>
            </div>
        );
    }
});

module.exports = React.createClass({
    render: function () {
        var business = this.props.business || {};
        var address  = business.address || {};

        var displayAddress = _.isEmpty(address) ? null : address.street + ', ' + address.zipCode + ', ' + address.city + '.';
        var linkToMap = _.isEmpty(address) ? null : <a href="#location" className="linkToMap">(Voir&nbsp;la&nbsp;carte)</a>;

        return (
            <section className="salon-info">
              <div className="row">
                <div className="col-sm-8">
                  <h1>{business.name}</h1>
                  <h2>{displayAddress} {linkToMap}</h2>
                </div>
                <Rating rating={business.rating} numReviews={business.numReviews} />
              </div>
              <div className="row">
                <div className="prix col-xs-12 col-sm-12">
                    {this.renderAveragePrice()}
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
    }
});
