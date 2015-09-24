'use strict';

var React = require('react');
var SearchBar = require('../Layout/SearchBar.jsx');


module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section home-search" id="search">
                <h2>Vous cherchez un coiffeur ?</h2>
                <div className="row">
                    <SearchBar homepage={true} {...this.props} />
                </div>
            </section>
       );
    },
});