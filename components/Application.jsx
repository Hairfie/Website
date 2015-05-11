'use strict';

var React = require('react');
var _ = require('lodash');
var ga = require('../services/analytics')
var handleHistory = require('fluxible-router').handleHistory;

var Application = React.createClass({
    render: function () {
        ga('send', 'pageview', {
            'page': this.props.currentRoute.get('url')
        });

        var Handler = this.props.currentRoute.get('handler');

        return React.createElement(Handler, {
            route: this.props.currentRoute.toJS()
        });
    }
});

Application = handleHistory(Application);

module.exports = Application;
