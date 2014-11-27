/** @jsx React.DOM */

var React = require('react');

var UserStatus = require('./UserStatus.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');


module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div>
                <Header context={this.props.context} />
                <div className={ 'container-fluid ' + this.props.customClass }>
                    {this.props.children}
                </div>
                <Footer context={this.props.context} />
            </div>
        );
    }
});
