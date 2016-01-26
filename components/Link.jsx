'use strict';

var React = require('react');
var _ = require('lodash');
var NavLink = require('fluxible-router').NavLink;
var Actions = require('../constants/Actions');

var Link = React.createClass({
    contextTypes: {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    },
    getInitialState: function () {
        return { href: this._getHrefFromProps(this.props) };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({ href: this._getHrefFromProps(nextProps) });
    },
    render: function () {
        if (this.props.noNav) {
            return <a role="button" {...this.props} onClick={this.changePath}>{this.props.children}</a>
        }
        else {
            return <NavLink href={this.state.href} {...this.props}>{this.props.children}</NavLink>;
        }
    },
    changePath: function (e) {
        if (this.props.noNav.removeNav) {
            window.history.back();
        }
        else if (this.props.noNav.changeNav) {
            window.history.back();
            window.history.pushState("", "", this.state.href);
        }
        else {
            window.history.pushState("", "", this.state.href);
        }
    },
    _getHrefFromProps: function (props) {
        var href = props.href || this.context.getStore('RouteStore').makeUrl(props.route, props.params, props.query);

        if (props.href && props.query) {
            _.map(props.query)
        }


        if (props.fragment) {
            href = href+'#'+props.fragment;
        }

        return href;
    }
});

module.exports = Link;
