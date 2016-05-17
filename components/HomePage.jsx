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
            displaySearch: false,
            findMe: false
        };
    },
    render: function () {
        return (
            <div className="front">
                <Notifications />
                <PageProgress />
                <section className="landing">
                    <Header 
                        ref='header'
                        home={true} 
                        displaySearch={this.state.displaySearch} 
                        findMe={this.state.findMe} />
                    <div className="container">
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Prenez RDV avec le<br className="title-break" /> coiffeur qui vous correspond</h1>
                                <h4 className="hidden-xs">Le meilleur de la coiffure, de la coloration, du lissage, des barbiers...</h4>
                            </div>
                        </div>
                        <div className="row">
                            <Home.SearchSection {...this.props} ref="search" openSearchBar={this.searchHairdresser}/>
                        </div>
                        <div className="row visible-xs">
                            <div className="search-group text-center">
                                <a onClick={this.searchHairdresser.bind(this, false)} className="btn btn-where">Où? (Ville, salon de coiffure...)</a>
                                <span onClick={this.searchHairdresser.bind(this, true)} >
                                    <a className="btn btn-around">Autour<br/> de moi</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="main-content" id="home">
                        <Home.HowSection />
                        <Home.Selections />
                        <Home.Styles />
                        <Home.Deals deals={this.props.deals} />
                        <Home.Press />
                        <Home.BlogPosts posts={this.props.posts} />
                        <Home.DownloadSection />
                    </div>
                </div>
                <Footer />
            </div>
        );
    },
    searchHairdresser: function(withFindMe) {
        this.refs.header.handleDisplaySearch(withFindMe);
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
        posts       : context.getStore('BlogPostStore').getRecent()
    };
});

module.exports = HomePage;
