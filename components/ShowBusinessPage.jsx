/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessStore = require('../stores/BusinessStore');
var PublicLayout = require('./PublicLayout.jsx');
var Map = require('./MapComponent.jsx');
var ShowHairfies = require('./ShowHairfies.jsx');
var ClaimExistingBusiness = require('./ClaimExistingBusiness.jsx');

var Navigate = require('flux-router-component/actions/navigate');

var NavLink = require('flux-router-component').NavLink;
var Button = require('react-bootstrap/Button');

var _ = require('lodash');
var weekDayLabel = require('../constants/DateTimeConstants').weekDayLabel;

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness(),
            discountObj: this.getStore(BusinessStore).getDiscountForBusiness()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;
        if(!business) {
            return (
                <div>Loading Business in progress</div>
            );
        } else {
            var address;

            if (business.address) {
                address = (
                    <span className="content">
                        {business.address.street} <br />
                        {business.address.zipCode + ' ' + business.address.city}
                    </span>
                )
            } else {
                address = (
                    <p>
                        Information not available
                    </p>
                )
            }

            var mapElement;
            if (business.gps) {
                mapElement = <Map marker={{lat: business.gps.lat, lng: business.gps.lng, title: business.name}} />
            }

            var bookingButtonNode, phoneNode;

            if(business.isBookable) {
                bookingButtonNode = (
                    <p className="booking-container">
                        <NavLink routeName="book_business" navParams={{id: this.state.business.id, slug: this.state.business.slug}} context={this.props.context}>
                            <Button className="btn-booking">
                                Réserver
                            </Button>
                        </NavLink>
                    </p>
                );
            } else {
                phoneNode = (
                    <p className="info phone">
                        <span className="icon icon-phone"></span>
                        <span className="content">
                            <span className="label label-red">{this.state.business.phoneNumber ? this.state.business.phoneNumber : 'Information not available'  }</span>
                        </span>
                    </p>
                );
            }

            return (
                <PublicLayout context={this.props.context}>
                    <div className="row" id="business-header">
                        <div className="col-sm-3 col-xs-12 map">
                            {mapElement}
                        </div>
                        <div className="col-sm-6 col-xs-8 infos">
                            <h1>{business.name}</h1>
                            <p className="info address">
                                <span className="icon icon-address"></span>
                                { address }
                            </p>
                            {phoneNode}
                            {this.renderDiscountNode()}
                            {this.renderServicesNode()}
                            {bookingButtonNode}
                            <p>
                                <ClaimExistingBusiness context={this.props.context} business={business} />
                            </p>
                        </div>
                        <div className="col-sm-3 col-xs-3 pictures">
                            <img src={business.pictures[0].url + '?height=430&width=300'} className="img-rounded img-responsive"/>
                        </div>
                    </div>
                    <div className="row business-hairfies">
                        <ShowHairfies businessId={this.state.business.id} context={this.props.context} />
                    </div>
                </PublicLayout>
            );
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    renderDiscountNode: function() {
        if(this.state.discountObj.max) {
            return (
                <p className="info discounts">
                    <span className="icon icon-discount"></span>
                    <span className="content">
                        <NavLink routeName="book_business" navParams={{id: this.state.business.id, slug: this.state.business.slug}} context={this.props.context}>
                            <span className="label label-discount">
                                {this.state.discountObj.max} %
                            </span>
                        </NavLink>
                        <span className="legend">
                            sur toutes les prestations et tous les achats *
                        </span>
                    </span>
                </p>
            );
        } else {
            return null;
        }
    },
    renderServicesNode: function() {
        var services = this.state.business.services;
        if(services && services.length > 0) {
            return (
                <p className="info services">
                    <span className="icon icon-price"></span>
                    <span className="content">
                        {_.map(services, function(service) {return service.price.amount + '€, ' })}
                    </span>
                </p>
            );
        };
    }
});

function createMap(el) {
    var options = {};
    options.zoom = 16;

    return Google
        .loadMaps()
        .then(function (google) {
            return new google.maps.Map(el, options);
        });
}
