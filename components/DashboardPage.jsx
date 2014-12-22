/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var ProLayout = require('./ProLayout.jsx');
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var UserManagedBusinessStore = require('../stores/UserManagedBusinessStore');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [AuthStore, UserManagedBusinessStore]
    },
    getStateFromStores: function () {
        var user = this.getStore(AuthStore).getUser();

        return {
            user                : user,
            managedBusinesses   : user && this.getStore(UserManagedBusinessStore).getManagedBusinessesByUser(user)
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        var managedBusinesses = (this.state.managedBusinesses || []).map(function (business) {
            return this.renderBusiness(business);
        }, this);
        return (
            <ProLayout context={this.props.context} withoutSideBar={true}>
                <h3>Mes salons</h3>
                {managedBusinesses}
            </ProLayout>
        );
    },
    renderBusiness: function(business) {
        return (
            <div className="col-sm-6 col-md-4 business-item" key={business.id}>
                <div className="thumbnail">
                    <img src={business.pictures[0].url} className="img-responsive" />
                    <div className="caption">
                        <h3>{business.name}</h3>
                        <p>{business.numHairfies} Hairfies | {business.numReview ? business.numReview : 0} reviews </p>
                        <NavLink context={this.props.context} routeName="pro_business" navParams={{id: business.id, step: 'general'}}>
                            <button className="btn btn-primary" role="button">Gérer ce business</button>
                        </NavLink>

                        <a href={business.landingPageUrl} className="btn btn-primary" role="button" target="_blank">Afficher la page publique</a>
                    </div>
                </div>
            </div>
        );
    }
});
