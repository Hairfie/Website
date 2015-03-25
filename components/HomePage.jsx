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
var HomePageMixin = require('./Home/HomePageMixin.jsx');

var _ = require('lodash');

var PlaceAutocompleteInput = require('./Form/PlaceAutocompleteInput.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var BusinessActions = require('../actions/Business');

var SearchBar = React.createClass({
    render: function () {
        if(this.props.mobile) {
            return this.renderMobile();
        } else {
            return this.renderMain();
        }
    },
    renderMain: function() {
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
    renderMobile: function() {
        return (
            <div className="mobile-nav visible-xs">
                <header className="container">
                    <NavLink context={this.props.context} className="logo col-xs-4" routeName="home" />
                    <a href="#" className="col-xs-4 menu-trigger pull-right"></a>
                </header>
                <div className="mobile-menu">
                    <div className="container">
                        <h2>Réservez votre coiffeur</h2>
                        <span className="hr"></span>
                        <div className="searchbar col-xs-10">
                            <PlaceAutocompleteInput className='col-xs-12' ref="location" placeholder="Où ?" />
                            <input className='col-xs-12' ref="query" type="search" placeholder='Nom, spécialité...' />
                            <input type="date" className='col-xs-12'/>
                            <Button onClick={this.submit} className='btn btn-red col-xs-12'>Lancer la recherche</Button>
                        </div>
                    </div>
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
                        <h3>Trouvez</h3>
                        <p>Trouvez le coiffeur qui vous correspond en fonction de vos critères : votre style, votre budget etc...</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Réservez</h3>
                        <p>Réservez gratuitement ce salon en 2 clics</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Partagez votre #Hairfie</h3>
                        <p>Partagez votre #Hairfie.</p>
                    </div>
                </div>
            </section>
       );
    },
});

var LinkSection = React.createClass({
    render: function () {
        return (
            <section className="home-section seo">
                <h2>Les liens les plus recherchés</h2>
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        {this.renderLink("Barbier à Paris", "Paris--France", "Barbier")}
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        {this.renderLink("Barbier dans le Marais", "Le-Marais--Paris--France", "Barbier")}

                    </div>
                    <div className="col-sm-4 col-xs-12">
                        {this.renderLink("Le meilleur du Marais", "Le-Marais--Paris--France")}
                    </div>
                </div>
            </section>
       );
    },
    renderLink: function(displayText, address, category) {
        var href = category ? this.props.context.makeUrl('business_search_results', {address: address}, {categories: category}) : this.props.context.makeUrl('business_search_results', {address: address});
        return (
            <p>
                <NavLink href={href} context={this.props.context}>
                    <span>{displayText}</span>
                </NavLink>
            </p>
        );
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin, HomePageMixin],
    render: function () {
        return (
            <div className="front">
                <section className="landing">
                    <div className="container">
                        <Header context={this.props.context} withLogin={this.props.withLogin} headerClassName='normal' />
                        <SearchBar context={this.props.context} mobile={true} />
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
                        <LinkSection context={this.props.context} />
                    </div>
                </div>
                <Footer context={this.props.context} />
            </div>
        );
    }
});
