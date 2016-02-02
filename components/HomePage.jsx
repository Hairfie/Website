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
                    <Header home={true} displaySearch={this.state.displaySearch} findMe={this.state.findMe} />
                    <div className="container">
                        <div className="row">
                            <div className="headline col-md-12">
                                <h1>Faites du bien à vos cheveux,<br className="title-break" /> Trouvez leur le bon coiffeur&nbsp;!</h1>
                            </div>
                        </div>
                        <div className="row">
                            <Home.SearchSection {...this.props} ref="search" openSearchBar={this.searchHairdresser}/>
                        </div>
                        {/*<div className="row choice-large">
                            <a onClick={this.scrollTo.bind(this, "categories")} className="btn btn-red">Des coiffures stylées</a>
                            <a onClick={this.searchHairdresser} className="btn btn-red">Des coiffeurs au top</a>
                        </div>*/}
                        <div className="row visible-xs">
                            <div className="search-group text-center">
                                <a onClick={this.searchHairdresser} className="btn btn-where">Où? (Ville, salon de coiffure...)</a>
                                <span onClick={this.searchHairdresser.bind(this, true)} >
                                    <a className="btn btn-around">Autour<br/> de moi</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container">
                    <div className="main-content" id="home">
                        
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
    searchHairdresser: function(withFindMe) {
        var findMe = _.isBoolean(withFindMe) ? withFindMe : false;
        if($('.mobile-menu').is(':visible')) {
            if( $('.mobile-menu').height() == 0 ) {
                this.setState({displaySearch: true, findMe: findMe});
                $('body').toggleClass('locked');
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0, {height:'100vh',ease:Power2.easeInOut});
            } else {
                this.setState({displaySearch: false, findMe: false});
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
