'use strict';

var React = require('react');

var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var Notifications = require('./Notifications.jsx');
var SearchBar = require('./Layout/SearchBar.jsx');
var PageProgress = require('./PageProgress.jsx');

module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div className="front">
                <PageProgress context={this.props.context} />
                <div className="container">
                    <Header
                        {...this.props}
                    />
                    {this.renderSearchBar()}
                    <SearchBar context={this.props.context} mobile={true} />
                </div>
                <Notifications />
                {this.props.children}
                <div className="row" />
                <Footer context={this.props.context} />
                <Footer context={this.props.context} mobile={true} />
            </div>
        );
    },
    renderSearchBar: function () {
        if (!this.props.withSearchBar) return;

        return (
            <div className="row hidden-xs hidden-sm">
                <SearchBar context={this.props.context} />
            </div>
        );
    }
});
