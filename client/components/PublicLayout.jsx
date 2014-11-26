/** @jsx React.DOM */

var React = require('react');

var UserStatus = require('./UserStatus.jsx');

module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div>
                <UserStatus context={this.props.context} />
                {this.props.children}
            </div>
        );
    }
});
