'use strict';

var React = require('react');
var _ = require('lodash');

var NavLink = require('flux-router-component').NavLink;
var Picture = require('../Partial/Picture.jsx');

var DateTimeConstants = require('../../constants/DateTimeConstants');
var orderWeekDays = DateTimeConstants.orderWeekDays;
var weekDayLabel = DateTimeConstants.weekDayLabel;

module.exports = React.createClass({
    render: function () {
        var business = this.props.business;
        var displayAddress = business.address ? business.address.street + ' ' + business.address.city : null;

        return (
            <div className="sidebar col-md-3 col-sm-12 pull-left">
                <div className="salon-bloc">
                    <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}} context={this.props.context}>
                        <Picture picture={business.pictures[0]}
                           resolution={{width: 220, height: 220}} />
                    </NavLink>
                    <div className="address-bloc">
                        <h2><a href="#">{business.name}</a></h2>
                        <a href="#" className="address">{displayAddress}</a>
                    </div>
                </div>
                {this.renderDiscountsNode()}
                <div>
                    {this.renderDiscountsConditions()}
                    <div>
                        <h3>Réserver en ligne na que des avantages </h3>
                        <ul>
                            <li>- Rapide</li>
                            <li>- Gratuit</li>
                            <li>- Pratique</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    renderDiscountsNode: function() {
        var business = this.props.business,
            discounts = this.props.discountObj && this.props.discountObj.discountsAvailable;

        if(!discounts || discounts.length === 0) {
            return null;
        }

        return (
            <div className="promo">
                { _.map(discounts, this.renderDiscountNode, this) }
            </div>
        );
    },
    renderDiscountNode: function(days, amount) {
        if (!_.isArray(days)) days = [days];
        return (
            <p>
                {amount}% sur toutes les prestations et tous les achats.
                Disponible {_.map(orderWeekDays(days), weekDayLabel, this).join(' ')}.
            </p>
        );
    },
    renderDiscountsConditions: function() {
        if(this.props.discountObj && this.props.discountObj.discountsAvailable.length > 0) {
            return (<p>* Cette offre nest valable que pour les réservations en ligne. Lachat de produits du salon avec cette offre est exclusivement liée à une prestation.</p>);
        }
    }
});
