/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');
var UserStatus = require('./UserStatus.jsx');
var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');
var PageProgress = require('./PageProgress.jsx');

var Home = require('./Home');

var SearchBar = require('./Layout/SearchBar.jsx');
var connectToStores = require('fluxible/addons/connectToStores');

var _ = require('lodash');

var HomePage = React.createClass({
    mixins: [Home.Mixin],
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
                        <Home.Categories context={this.props.context} categories={this.props.categories} />
                        <Home.Deals context={this.props.context} deals={this.props.deals} />
                        <Home.TopHairfies context={this.props.context} hairfies={this.props.hairfies} />
                        <Home.HowSection />
                        <Home.LinksSection context={this.props.context} links={this.props.links} />
                    </div>
                </div>
                <Footer context={this.props.context} />
                <Footer context={this.props.context} mobile={true} />
            </div>
        );
    }
});

HomePage = connectToStores(HomePage, [
    require('../Stores/CategoryStore'),
    require('../Stores/TopDealsStore'),
    require('../Stores/TopHairfiesStore'),
    require('../stores/HomeLinkStore')
], function (stores, props) {
    return {
        categories  : stores.CategoryStore.all(),
        deals       : stores.TopDealsStore.get(props.route.config.numTopDeals),
        hairfies    : stores.TopHairfiesStore.get(props.route.config.numTopHairfies),
        links       : stores.HomeLinkStore.all()
    };
});

module.exports = HomePage;
