/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        if (this.props.loading) {
            return <div>Chargement en cours...</div>;
        }

        return <div>{this.props.children}</div>;
    }
});
