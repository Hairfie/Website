'use strict';

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');
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
                <PageProgress />
                <section className="landing">
                    <div className="container">
                        <Header withLogin={this.props.withLogin} headerClassName='normal' />
                        <SearchBar mobile={true} />
                        <FlashMessages />
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Trouvez votre coupe. <br />Réservez votre coiffeur.</h1>
                                <p>Des photos valent mieux qu'un long discours. <br />Prenez gratuitement RDV avec le coiffeur qui vous correspond.</p>
                            </div>
                        </div>
                        <div className="row">
                            <SearchBar homepage={true} />
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="main-content" id="home">
                        <Home.Categories categories={this.props.categories} />
                        <Home.Deals deals={this.props.deals} />
                        <Home.TopHairfies hairfies={this.props.hairfies} />
                        <Home.HowSection />
                        <Home.LinksSection links={this.props.links} />
                    </div>
                </div>
                <Footer />
                <Footer mobile={true} />
            </div>
        );
    }
});

HomePage = connectToStores(HomePage, [
    require('../stores/CategoryStore'),
    require('../stores/TopDealsStore'),
    require('../stores/TopHairfiesStore'),
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
