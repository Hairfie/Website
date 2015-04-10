/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var RouterMixin = require('flux-router-component').RouterMixin;
var ga = require('../services/analytics')
var connectToStores = require('fluxible/addons/connectToStores');

var Application = React.createClass({
    mixins: [RouterMixin],
    propTypes: {
        context: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {route: this.props.route};
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({route: nextProps.route})
    },
    render: function () {
        var route     = this.props.route,
            component = route && route.config && route.config.pageComponent;

        ga('send', 'pageview', {
            'page': route.url
        });

        return React.createElement(route.config.pageComponent, {
            context : this.props.context,
            route   : route
        });
    }
});

Application = connectToStores(Application, [
    require('../stores/RouteStore')
], function (stores, props) {
    return {
        route: stores.RouteStore.getCurrentRoute()
    };
});

module.exports = Application;
