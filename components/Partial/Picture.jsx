/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return <img {...this.props} style={{width:'50px', height:'50px'}} src={this.getSrc()} />
    },
    getSrc: function () {
        var query = [];
        if (this.props.width) query.push('width='+this.props.width);
        if (this.props.height) query.push('height='+this.props.height);

        return this.props.picture.url+'?'+query.join('&');
    }
});
