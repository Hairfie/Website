'use strict';

var React = require('react');

var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var Notifications = require('./Notifications.jsx');
var PageProgress = require('./Layout/PageProgress.jsx');

module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div className="front">
                <Notifications />
                <PageProgress context={this.props.context} />
                <div className="container">
                    <Header context={this.props.context} withProLink={this.props.withProLink || true} />
                </div>
                {this.props.children}
                <div className="row" />
                <Footer context={this.props.context} />
            </div>
        );
    }
});
