/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');
var UserStatus = require('./UserStatus.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');

var FluxibleMixin = require('fluxible').Mixin;

var CategoriesSection = require('./HomePage/CategoriesSection.jsx');
var DealsSection = require('./HomePage/DealsSection.jsx');
var TopHairfiesSection = require('./HomePage/TopHairfiesSection.jsx');
var HomePageMixin = require('./HomePage/HomePageMixin.jsx');
var SearchBar = require('./Partial/SearchBar.jsx');

var _ = require('lodash');


var BusinessActions = require('../actions/Business');


var HowSection = React.createClass({
    render: function () {
        return (
            <section className="home-section home-footer">
                <h2>Comment ça marche ?</h2>
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Inspiration</h3>
                        <p>Trouvez la coiffure et le coiffeur qui vous correspondent</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Réservation</h3>
                        <p>Réservez en 3 clics, 24/7</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="images/placeholder-homecontent4.png" alt="#" />
                        <h3>Partage</h3>
                        <p>Partagez votre #Hairfie et donnez votre avis</p>
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
                                <h1>Trouvez votre coupe. Réservez votre coiffeur.</h1>
                                <p>Un #Hairfie, c'est une photo de coiffure prise depuis votre smartphone. C'est le petit frère du Selfie.</p>
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
