/** @jsx React.DOM */

'use strict';

var React = require('react');

var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var Layout = require('./ProLayout.jsx');
var NavLink = require('flux-router-component').NavLink;

var lodash = require('lodash');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness(),
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;
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
        lodash.each(business.timetable, function(day) {
            if(day.length > 0) { openDays++ }
        });

        return (
            <Layout context={this.props.context} business={business} customClass={'business-dashboard'}>
                <div className="title">
                    <span>
                        <img src={business.pictures[0].url} className="img-circle" />
                    </span>
                    <span>
                        <h1>{business.name}</h1>
                    </span>
                    <hr />
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{infos}</h3>
                        <NavLink context={this.props.context} routeName="pro_business_infos" navParams={{id: business.id}}>
                            <button className="btn btn-primary" role="button">Modifier mes infos</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{business.activeHairdressers.length} coiffeur(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_hairdressers" navParams={{id: business.id, step: 'general'}}>
                            <button className="btn btn-primary" role="button">Modifier mes coiffeurs</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{(business.services||[]).length} service(s) proposé(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_services" navParams={{id: business.id, step: 'general'}}>
                            <button className="btn btn-primary" role="button">Modifier mes services</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{openDays} jour(s) d'ouverture renseigné(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_timetable" navParams={{id: business.id, step: 'general'}}>
                            <button className="btn btn-primary" role="button">Modifier mes horaires</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{business.numHairfies} Hairfie(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_hairfies" navParams={{id: business.id, step: 'general'}}>
                            <button className="btn btn-primary" role="button">Gérer mes hairfies</button>
                        </NavLink>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 business-dashboard-item">
                    <div className="thumbnail">
                        <h3>{business.pictures.length} photos(s)</h3>
                        <NavLink context={this.props.context} routeName="pro_business_photos" navParams={{id: business.id, step: 'general'}}>
                            <button className="btn btn-primary" role="button">Modifier mes photos</button>
                        </NavLink>
                    </div>
                </div>
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
