/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessSearchActions = require('../actions/BusinessSearch');
var BusinessSearchStore = require('../stores/BusinessSearchStore');

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var AddressInput = require('./Form/AddressInput.jsx');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessSearchStore]
    },
    getStateFromStores: function () {
        var businesses  = this.getStore(BusinessSearchStore).getBusinesses();
        return {
            businesses        : businesses
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var businesses = this.state.businesses;
        var searchResultNodes = (businesses.length > 0) ? businesses.map(this.renderBusinessRow) : null;

        return (
            <PublicLayout context={this.props.context} withLogin={true} customClass={'search'}>
                <div className="row">
                    <div className="col-sm-5 col-sm-offset-3">
                        <form role="form" className="claim">
                            <Input ref="businessName" type="text" placeholder="Nom du Salon" />
                            <AddressInput ref="businessAddress" placeholder="Ville ou Adresse " />
                            <Button className="btn-red btn-block" onClick={this.submit}>Rechercher</Button>
                        </form>
                    </div>
                </div>
                <div className="row">
                    { searchResultNodes }
                </div>
            </PublicLayout>
        );
    },
    renderBusinessRow: function(business) {
        return (
            <div className="media" key={business.id}>
                <NavLink context={this.props.context} className="media-left" routeName="show_business" navParams={{id: business.id, slug: business.slug}}>
                    <img src={business.pictures[0].url + '?height=100&width=100'} className="img-responsive" />
                </NavLink>
                <div className="media-body">
                    <h4 className="media-heading">{business.name}</h4>
                    <p>{business.address.street} - {business.address.zipCode} {business.address.city}</p>
                    <p>{business.numHairfies} Hairfie(s)</p>
                </div>
            </div>
        );
    },
    submit: function (e) {
        e.preventDefault();
        console.log("nom", this.refs.businessName.getValue());
        console.log("gps", this.refs.businessAddress.getGps());
        var gps = this.refs.businessAddress.getGps();

        this.props.context.executeAction(BusinessSearchActions.Search, {
            params    : {
                query       : this.refs.businessName.getValue(),
                gps         : gps.lng + ',' + gps.lat
            }
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

