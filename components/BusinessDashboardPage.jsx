/** @jsx React.DOM */

'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var BusinessStore = require('../stores/BusinessStore');
var Layout = require('./ProLayout.jsx');
var NavLink = require('flux-router-component').NavLink;
var Picture = require('./Partial/Picture.jsx');

var lodash = require('lodash');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getById(this.props.route.params.businessId),
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;

        if (!business) {
            return <Layout context={this.props.context} loading={true} />
        }

        var infos;
        if (business.address) {
                infos = (
                    <span className="content">
                       {business.address.street} <br />
                        {business.address.zipCode} {business.address.city}
                    </span>
                );
        } else {
            infos = (<span>Adresse inconnue</span>)
        }

        var openDays = 0;
        lodash.each(business.timetable, function (day) {
            if (day.length > 0) { openDays++ }
        });

        return (
            <Layout context={this.props.context} business={business} customClass={'business-dashboard'}>
                <div className="title">
                    <span>
                        <Picture picture={business.pictures[0]} className="img-circle" placeholder="/images/placeholder-55.png"/>
                    </span>
                    <span>
                        <h1>{business.name}</h1>
                    </span>
                </div>

                <h3 className="sub-title">Monitoring</h3>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{business.numHairfies} Hairfie(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_hairfies" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Gérer mes hairfies</button>
                        </NavLink>
                    </div>
                </div>
                <div className="clearfix" />

                <h3 className="sub-title">Paramètres du salon</h3>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{infos}</h3>
                        <NavLink context={this.props.context} routeName="pro_business_infos" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes infos</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{business.activeHairdressers.length} coiffeur(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_members" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes coiffeurs</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{(business.services||[]).length} service(s) proposé(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_services" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes services</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{openDays} jour(s) d'ouverture renseigné(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_timetable" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes horaires</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{business.pictures.length} photos(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_photos" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes photos</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>Réseaux sociaux</h3>
                        <NavLink context={this.props.context} routeName="pro_business_social_networks" navParams={{businessId: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes réseaux sociaux</button>
                        </NavLink>
                    </div>
                </div>
                <div className="clearfix" />
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
