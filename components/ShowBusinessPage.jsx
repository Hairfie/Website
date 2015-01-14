/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessStore = require('../stores/BusinessStore');
var PublicLayout = require('./PublicLayout.jsx');
var Map = require('./MapComponent.jsx');
var ShowHairfies = require('./ShowHairfies.jsx');
var ClaimExistingBusiness = require('./ClaimExistingBusiness.jsx');

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
                        {business.address.zipCode} {business.address.city}
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

            var bookingButtonNode;

            if(business.isBookable) {
                bookingButtonNode = (
                    <p>
                        <Button className="btn-red btn-block">
                            <NavLink routeName="book_business" navParams={{id: this.state.business.id, slug: this.state.business.slug}} context={this.props.context}>
                                Réserver
                            </NavLink>
                        </Button>
                    </p>
                );
            }

            var discountNode = this.renderDiscountNode();

            return (
                <PublicLayout context={this.props.context}>
                    <div className="row" id="business-header">
                        <div className="col-sm-3 col-xs-3 pictures">
                            <img src={business.pictures[0].url + '?height=430&width=300'} className="img-rounded img-responsive"/>
                        </div>
                        <div className="col-sm-6 col-xs-8 infos">
                            <h1>{business.name}</h1>
                            <p className="info address">
                                <span className="icon icon-address"></span>
                                { address }
                            </p>
                            <p className="info phone">
                                <span className="icon icon-phone"></span>
                                <span className="content">
                                    <span className="label label-red">{this.state.business.phoneNumber ? this.state.business.phoneNumber : 'Information not available'  }</span>
                                </span>
                            </p>
                            {discountNode}
                            {bookingButtonNode}
                            <p>
                                <ClaimExistingBusiness context={this.props.context} business={business} />
                            </p>
                        </div>
                        <div className="col-sm-3 col-xs-12 map">
                            {mapElement}
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
        var business = this.state.business,
            discountNode,
            discounts = _.reduce(business.timetable, function(result, timetable, day) {
                var values = _.compact(_.pluck(timetable, 'discount'));
                if(values.length > 0) {
                    var label = weekDayLabel(day) + ' : - ' + _.max(values) + '%';
                    result.push(label);
                }
                return result;
            }, []);

        if(discounts.length > 0) {
            discountNode = (
                <p className="info discounts">
                    <span className="icon icon-discount"></span>
                    <span className="content">
                        {_.map(discounts, function(label) {
                            return (
                                <span className="label label-discount">{label}</span>
                            );
                        }, this)}
                    </span>
                </p>
            );
        }

        return discountNode;
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
