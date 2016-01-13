'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');

var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var Notifications = require('./Notifications.jsx');
var SearchBar = require('./Layout/SearchBar.jsx');
var PageProgress = require('./Layout/PageProgress.jsx');

var wooboxHtml = "(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = '//woobox.com/js/plugins/woo.js';fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'woobox-sdk'))";

var ContestPage = React.createClass({
    render: function() {
        return (
            <div className="front">
                <Notifications />
                <PageProgress context={this.props.context} />
                <div className="container">
                    <div className="row hidden-xs">
                        <SearchBar context={this.props.context} />
                    </div>
                    <SearchBar context={this.props.context} mobile={true} noSearch={true}/>
                </div>
                    <div className="container contest">
                        <section className="title">
                            <div className="container">
                                <div className='woobox-offer' data-offer='zvtgxf' />
                                <div id='woobox-root' />
                                <script type="text/javascript" dangerouslySetInnerHTML={{__html: wooboxHtml}} />

                            </div>
                        </section>
                    </div>
                <div className="row" />
                <Footer context={this.props.context} />
                <Footer context={this.props.context} mobile={true} />
            </div> 
        );
    }
});

module.exports = ContestPage;