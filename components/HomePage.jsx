'use strict';

var React = require('react');
var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var Notifications = require('./Notifications.jsx');
var PageProgress = require('./Layout/PageProgress.jsx');

var Home = require('./Home');

var SearchBar = require('./Layout/SearchBar.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');

var _ = require('lodash');

var HomePage = React.createClass({
    mixins: [Home.Mixin],
    render: function () {
        return (
            <div className="front">
                <Notifications />
                <PageProgress />
                <section className="landing">
                    <div className="container">
                        <Header withLogin={this.props.withLogin} headerClassName='normal' />
                        <SearchBar mobile={true} {...this.props}/>
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Trouvez votre coupe<br />Réservez votre coiffeur</h1>
                                <p>Des photos valent mieux qu'{/* ' */}un long discours. <br />Prenez gratuitement RDV avec le coiffeur qui vous correspond.</p>
                            </div>
                        </div>
                        <div className="row choice">
                            <a onClick={this.scrollTo.bind(this, "categories")} className="btn btn-red">Je cherche une coupe</a>
                            <a onClick={this.searchHairdresser} className="btn btn-red">Je cherche un coiffeur</a>
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="main-content" id="home">
                        <Home.SearchSection {...this.props} ref="search" />
                        <Home.Categories categories={this.props.categories} tags={this.props.tags} ref="categories" />
                        <Home.BlogPosts posts={this.props.posts} />
                        <Home.Deals deals={this.props.deals} />
                        <Home.TopHairfies hairfies={this.props.hairfies} />
                        <Home.HowSection />
                        <Home.DownloadSection />
                        <Home.LinksSection links={this.props.links} />
                    </div>
                </div>
                <Footer />
                <Footer mobile={true} />
            </div>
        );
    },
    searchHairdresser: function() {
        if($('.mobile-menu').is(':visible')) {
            if( $('.mobile-menu').height() == 0 ) {
                $('body').toggleClass('locked');
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0.4, {height:'100vh',ease:Power2.easeInOut});
            } else {
                $('body').toggleClass('locked');
                $('.menu-trigger').removeClass('close');
                TweenMax.to('.mobile-menu', 0.4, {height:0,ease:Power2.easeOut});
            }
        } else {
            this.scrollTo("search");
        }
    },
    componentWillUnmount: function() {
        $('body').removeClass('locked');
    },
    scrollTo: function(toRef) {
        var target = this.refs[toRef];
        TweenMax.to(window, 0.5, {scrollTo:{y:target.offsetTop}, ease:Power2.easeOut});
    }
});

HomePage = connectToStores(HomePage, [
    'CategoryStore',
    'TagStore',
    'HairfieStore',
    'DealStore',
    'HomeLinkStore',
    'BlogPostStore'
], function (context, props) {
    return {
        categories  : context.getStore('CategoryStore').getAllCategories(),
        tags        : context.getStore('TagStore').getAllTags(),
        deals       : context.getStore('DealStore').getTop(),
        hairfies    : context.getStore('HairfieStore').getTop(),
        links       : context.getStore('HomeLinkStore').all(),
        posts       : context.getStore('BlogPostStore').getRecent()
    };
});

module.exports = HomePage;
