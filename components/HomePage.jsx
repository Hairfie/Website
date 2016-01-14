'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var Notifications = require('./Notifications.jsx');
var PageProgress = require('./Layout/PageProgress.jsx');

var Home = require('./Home');

var connectToStores = require('fluxible-addons-react/connectToStores');

var _ = require('lodash');

var HomePage = React.createClass({
    mixins: [Home.Mixin],
    getInitialState: function() {
        return {
            displaySearch: false
        };
    },
    render: function () {
        return (
            <div className="front">
                <Notifications />
                <PageProgress />
                <section className="landing">
                    <div className="container">
                        <Header home={true} displaySearch={this.state.displaySearch}/>
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Faites du bien à vos cheveux,<br />Trouvez leur le bon coiffeur !</h1>
                                <p> Ici, pas de blabla mais des milliers de photos de vrais clients pour faire son choix et prendre RDV gratuitement en ligne 24/7 dans le salon de coiffure qui vous correspond.</p>
                            </div>
                        </div>
                        <div className="row choice">
                            <p className="search-word">Je cherche&nbsp;:</p>
                            <a onClick={this.scrollTo.bind(this, "categories")} className="btn btn-red">Des coiffures stylées</a>
                            <a onClick={this.searchHairdresser} className="btn btn-red">Des coiffeurs au top</a>
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="main-content" id="home">
                        <Home.SearchSection {...this.props} ref="search" />
                        <Home.Categories categories={this.props.categories} tags={this.props.tags} ref="categories" />
                        <Home.Deals deals={this.props.deals} />
                        <Home.BlogPosts posts={this.props.posts} />
                        <Home.TopHairfies hairfies={this.props.hairfies} />
                        <Home.HowSection />
                        <Home.DownloadSection />
                    </div>
                </div>
                <Footer />
            </div>
        );
    },
    searchHairdresser: function() {
        if($('.mobile-menu').is(':visible')) {
            if( $('.mobile-menu').height() == 0 ) {
                this.setState({displaySearch: true});
                $('body').toggleClass('locked');
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0, {height:'100vh',ease:Power2.easeInOut});
            } else {
                this.setState({displaySearch: false});
                $('body').toggleClass('locked');
                $('.menu-trigger').removeClass('close');
                TweenMax.to('.mobile-menu', 0, {height:0,ease:Power2.easeOut});
            }
        } else {
            this.scrollTo("search");
        }
    },
    componentWillUnmount: function() {
        $('body').removeClass('locked');
    },
    scrollTo: function(toRef) {
        var target = ReactDOM.findDOMNode(this.refs[toRef]);
        TweenMax.to(window, 0.5, {scrollTo:{y:target.offsetTop}, ease:Power2.easeOut});
    }
});

HomePage = connectToStores(HomePage, [
    'CategoryStore',
    'TagStore',
    'HairfieStore',
    'DealStore',
    'BlogPostStore'
], function (context, props) {
    return {
        categories  : context.getStore('CategoryStore').getAllCategories(),
        tags        : context.getStore('TagStore').getAllTags(),
        deals       : context.getStore('DealStore').getTop(),
        hairfies    : context.getStore('HairfieStore').getTop(),
        posts       : context.getStore('BlogPostStore').getRecent()
    };
});

module.exports = HomePage;
