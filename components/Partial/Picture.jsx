/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return <img {...this.props} src={this.getSrc()} />
    },
    getSrc: function () {
        var query = [];

        var resolution = this.props.resolution || {};
        if (resolution.width) query.push('width='+resolution.width);
        if (resolution.height) query.push('height='+resolution.height);

        return this.props.picture.url+'?'+query.join('&');
    }
});
