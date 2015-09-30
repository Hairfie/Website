'use strict';

var React = require('react');
var _ = require('lodash');
var cloudinary = require('cloudinary/lib/utils');

module.exports = React.createClass({
    contextTypes: {
        getAssetUrl: React.PropTypes.func.isRequired
    },
    getDefaultProps: function () {
        return {
            options: {},
        }
    },
    getInitialState: function() {
        return {
            maxWidth: null
        }
    },
    componentDidMount: function () {
        this.setState({maxWidth: window.screen.width});

        if (!this.placeholder) return;

        var $image = jQuery(this.refs.image.getDOMNode());
        $image.attr('src', this.context.getAssetUrl(this.props.placeholder));
        $image.one('load', function () {
            $image.attr('src', this.getSrc());
        }.bind(this));
    },
    render: function () {
        if(this.props.backgroundStyle) {
            return <img ref="image" {...this.props} style={this.getBackgroundStyle()} />
        }
        return <img ref="image" {...this.props} src={this.getSrc()} />
    },
    getBackgroundStyle: function() {
        return {
            backgroundImage: 'url(' + this.getSrc() + ')'
        }
    },
    getSrc: function () {
        if (!this.props.picture || !this.props.picture.url) return this.context.getAssetUrl(this.props.placeholder);

        if (this.props.picture.cloudinary) {
            return this.getCloudinarySrc();
        } 

        var query = [];
        var resolution = this._resolution();
        if (resolution.width) query.push('width='+resolution.width);
        if (resolution.height) query.push('height='+resolution.height);

        //var url = this.context.getAssetUrl(this.props.picture.url);

        return this.context.getAssetUrl(this.props.picture.url)+'?'+query.join('&');
    },
    getCloudinarySrc: function () {
        // BC
        var resolution = this._resolution();
        if (resolution.width || resolution.height) {
            resolution.crop = 'thumb';
        }

        var options = _.assign({
            type      : this.props.picture.cloudinary.type,
            cloud_name: this.props.picture.cloudinary.cloudName,
        }, this.props.options, resolution, {
            transformation: _.flatten(
                this.props.picture.cloudinary.transformation,
                this.props.options.transformation
            )
        });

        return cloudinary.url(this.props.picture.cloudinary.publicId, options);
    },
    _resolution: function () {
        var resolution = this.props.resolution || {};
        if (_.isNumber(resolution)) resolution = {width: resolution, height: resolution};

        return resolution;
    }
});
