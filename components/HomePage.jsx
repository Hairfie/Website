/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');
var UserStatus = require('./UserStatus.jsx');
var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');
var PageProgress = require('./PageProgress.jsx');

var FluxibleMixin = require('fluxible').Mixin;

var CategoriesSection = require('./HomePage/CategoriesSection.jsx');
var DealsSection = require('./HomePage/DealsSection.jsx');
var TopHairfiesSection = require('./HomePage/TopHairfiesSection.jsx');
var HomePageMixin = require('./HomePage/HomePageMixin.jsx');
var SearchBar = require('./Layout/SearchBar.jsx');

var _ = require('lodash');

var HowSection = React.createClass({
    render: function () {
        return (
            <section className="home-section home-footer">
                <h2>Comment ça marche ?</h2>
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        <img src="/img/search.png" alt="#" />
                        <h3>Découvrez</h3>
                        <p>Parcourez nos #Hairfies pour trouver la coiffure qui vous correspond</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="/img/book.png" alt="#" />
                        <h3>Réservez</h3>
                        <p>Réservez votre coiffeur gratuitement en 3 clics, 24/7</p>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <img src="/img/share.png" alt="#" />
                        <h3>Partagez</h3>
                        <p>Partagez votre #Hairfie <br />et donnez votre avis</p>
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
                <h2>Nos suggestions</h2>
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
    componentDidMount: function () {
        // animation
        TweenMax.set('.headline', {opacity:0,top:30});
        TweenMax.set('.searchbar.hidden-xs', {opacity:0,marginTop:'-=20'});
        TweenMax.set('.landing header.hidden-xs', {opacity:0});
        TweenMax.to('.landing header.hidden-xs', 1, {
            opacity:1,
            ease:Power4.easeInOut
        });
        TweenMax.to('.headline', 0.7, {
            opacity:1,
            top:0,
            ease:Power4.easeInut,
            delay:0.5
        });
        TweenMax.to('.searchbar.hidden-xs', 0.7, {
            opacity:1,
            marginTop:'+=20',
            ease:Power4.easeOut,
            delay:0.65
        });
    },
    render: function () {
        return (
            <div className="front">
                <PageProgress context={this.props.context} />
                <section className="landing">
                    <div className="container">
                        <Header context={this.props.context} withLogin={this.props.withLogin} headerClassName='normal' />
                        <SearchBar context={this.props.context} mobile={true} />
                        <FlashMessages context={this.props.context} />
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Trouvez votre coupe. <br />Réservez votre coiffeur.</h1>
                                <p>Des photos valent mieux qu'un long discours. <br />Prenez gratuitement RDV avec le coiffeur qui vous correspond.</p>
                            </div>
                        </div>
                        <div className="row">
                            <SearchBar context={this.props.context} homepage={true} />
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
                <Footer context={this.props.context} mobile={true} />
            </div>
        );
    }
});
