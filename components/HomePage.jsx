'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var Notifications = require('./Notifications.jsx');
var PageProgress = require('./PageProgress.jsx');

var Home = require('./Home');

var SearchBar = require('./Layout/SearchBar.jsx');
var connectToStores = require('../lib/connectToStores');

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
                        <SearchBar mobile={true} {...this.props}/>
                        <Notifications />
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Trouvez votre coupe. <br />Réservez votre coiffeur.</h1>
                                <p>Des photos valent mieux qu'un long discours. <br />Prenez gratuitement RDV avec le coiffeur qui vous correspond.</p>
                            </div>
                        </div>
                        <div className="row">
                            <SearchBar homepage={true} {...this.props} />
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
    'CategoryStore',
    'HairfieStore',
    'DealStore',
    'HomeLinkStore'
], function (stores, props) {
    return {
        categories  : stores.CategoryStore.getAllSorted(),
        deals       : stores.DealStore.getTop(),
        hairfies    : stores.HairfieStore.getTop(),
        links       : stores.HomeLinkStore.all()
    };
});

module.exports = HomePage;
