//te
'use strict';

var React = require('react');
var _ = require('lodash');
var ga = require('../services/analytics');
var handleHistory = require('fluxible-router').handleHistory;
var connectToStores = require('fluxible-addons-react/connectToStores');

var setTitle = typeof document == 'undefined' ? _.noop : function (title) {
    document.title = title;
};

var Application = React.createClass({
    contextTypes: {
        getStore: React.PropTypes.func
    },
    render: function () {
        ga('send', 'pageview', {
            'page': this.props.currentRoute.get('url')
        });

        setTitle(this.props.title);

        var Handler = this.props.currentRoute.get('handler');

        return React.createElement(Handler, {
            route: this.props.currentRoute.toJS()
        });
    }
});

Application = connectToStores(Application, ['MetaStore'], function (context) {
    return {
        title: context.getStore('MetaStore').getTitle()
    };
});
Application = handleHistory(Application);

module.exports = Application;
