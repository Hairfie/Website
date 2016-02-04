'use strict';

var React = require('react');
var SearchBar = require('../Layout/SearchBar.jsx');
var TabSection = require('./TabSection.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section home-search" id="search">
                <div className="hidden-xs home-search-desktop">
                    <div className="row">
                        <TabSection />
                    </div>
                </div>
            </section>
       );
    },
});