/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');
var UserStatus = require('./UserStatus.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');

var FluxibleMixin = require('fluxible').Mixin;

var CategoriesSection = require('./Home/CategoriesSection.jsx');
var DealsSection = require('./Home/DealsSection.jsx');
var TopHairfiesSection = require('./Home/TopHairfiesSection.jsx');

var _ = require('lodash');

var PlaceAutocompleteInput = require('./Form/PlaceAutocompleteInput.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var BusinessActions = require('../actions/Business');

var SearchBar = React.createClass({
    render: function () {
        return (
            <div className="searchbar main-searchbar">
                <div className="col-sm-6">
                    <PlaceAutocompleteInput ref="location" placeholder="Où ?" className='col-xs-6' />
                    <input className='col-xs-6' ref="query" type="search" placeholder='Nom, spécialité...' />
                </div>
                <div className="col-sm-6">
                    <input type="date" className='col-xs-6'/>
                    <Button onClick={this.submit} className='btn btn-red col-xs-6'>Trouvez votre coiffeur</Button>
                </div>
            </div>
       );
    },
    submit: function (e) {
        e.preventDefault();

        this.props.context.executeAction(BusinessActions.SubmitSearch, {
            search: {
                address: this.refs.location.getFormattedAddress(),
                query: this.refs.query.getDOMNode().value
            }
        });
    }
});

var HowSection = React.createClass({
    render: function () {
        return (
            <section className="home-section home-footer">
                <h2>Comment ça marche ?</h2>
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Titre 1</h3>
                        <p>dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore.</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Titre 2</h3>
                        <p>dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore.</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Titre 3</h3>
                        <p>dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore.</p>
                    </div>
                </div>
            </section>
       );
    },
});

module.exports = React.createClass({
    render: function () {
        return (
            <div className="front">
                <section className="landing">
                    <div className="container">
                        <Header context={this.props.context} withLogin={this.props.withLogin} headerClass='normal' />
                        <FlashMessages context={this.props.context} />
                        <div className="row">
                            <div className="headline  col-md-12">
                                <h1>Réservez votre coiffeur</h1>
                                <p>Lorem ipsum dolor sit amet, consectetuvr adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                            </div>
                        </div>
                        <div className="row">
                            <SearchBar context={this.props.context} />
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="main-content" id="home">
                        <CategoriesSection context={this.props.context} />
                        <DealsSection context={this.props.context} numTopDeals={this.props.route.config.numTopDeals} />
                        <TopHairfiesSection context={this.props.context} numTopHairfies={this.props.route.config.numTopHairfies} />
                        <HowSection />
                    </div>
                </div>
                <Footer context={this.props.context} />
            </div>
        );
    }
});
