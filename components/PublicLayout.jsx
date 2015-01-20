/** @jsx React.DOM */

var React = require('react');

var UserStatus = require('./UserStatus.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');

module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div>
                <FlashMessages context={this.props.context} />
                <Header context={this.props.context} withLogin={this.props.withLogin} />
                <div className={ 'container public-layout ' + this.props.customClass }>
                    {this.props.children}
                </div>
                <Footer context={this.props.context} />
            </div>
        );
    }
});
