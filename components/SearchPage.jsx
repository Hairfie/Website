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
            <PublicLayout context={this.props.context} withLogin={false} customClass={'search'}>
                <div className="row search-bar">
                    <div className="col-sm-8 col-sm-offset-2 form-container">
                        <form role="form" className="form-inline">
                            <Input ref="businessName" type="text" placeholder="Nom du Salon" />
                            <AddressInput ref="businessAddress" placeholder="Ville ou Adresse " onKeyDown={this.onKeyDown} />
                            <Button className="btn-red" onClick={this.submit}>Rechercher</Button>
                        </form>
                    </div>
                </div>
                <div className="row search-results">
                    { searchResultNodes }
                </div>
            </PublicLayout>
        );
    },
    renderBusinessRow: function(business) {
        return (
            <div className="media" key={business.id}>
                <NavLink context={this.props.context} className="media-left" routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}}>
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
        if(e) e.preventDefault();

        this.props.context.executeAction(BusinessSearchActions.Search, {
            query   : this.refs.businessName.getValue(),
            gps     : this.refs.businessAddress.getGps()
        });
    },
    onKeyDown: function(e) {
        if(e.key === 'Enter' && this.refs.businessAddress.getGps()) {
            this.submit();
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

