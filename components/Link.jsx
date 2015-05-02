'use strict';

var React = require('react');
var NavLink = require('flux-router-component').NavLink;

var Link = React.createClass({
    contextTypes: {
        makeUrl: React.PropTypes.func,
    },
    getInitialState: function () {
        return { href: this._getHrefFromProps(this.props) };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({ href: this._getHrefFromProps(nextProps) });
    },
    render: function () {
        return <NavLink href={this.state.href} {...this.props} />;
    },
    _getHrefFromProps: function (props) {
        var url = props.href || this.context.makeUrl(props.route, props.params, props.query);

        if (props.fragment) {
            url = url+'#'+props.fragment;
        }

        return url;
    }
});

module.exports = Link;
