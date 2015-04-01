/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');
var pkg = require('../../package.json');

module.exports = React.createClass({
    render: function () {
        return <img ref="image" {...this.props} src={this.getSrc()} />
    },
    componentDidMount: function () {
        if (!this.placeholder)

        var $image = jQuery(this.refs.image.getDOMNode());
        $image.attr('src', this.props.placeholder);
        $image.one('load', function () {
            $image.attr('src', this.getSrc());
        }.bind(this));
    },
    getSrc: function () {
        if (!this.props.picture || !this.props.picture.url) return this.props.placeholder;

        var query = [];

        var resolution = this.props.resolution || {};
        if (_.isNumber(resolution)) resolution = {width: resolution, height: resolution};

        if (resolution.width) query.push('width='+resolution.width);
        if (resolution.height) query.push('height='+resolution.height);

        query.push('v='+pkg.version);

        return this.props.picture.url+'?'+query.join('&');
    }
});
