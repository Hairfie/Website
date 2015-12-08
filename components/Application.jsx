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
    componentDidUpdate: function(prevProps) {

        if(this.props.currentRoute != prevProps.currentRoute) {
            if (!window.ga) {
                return;
            }
            ga('set', 'page',  this.props.currentRoute.url);
            ga('send', 'pageview');

            // ga('send', 'pageview', {
            //     'page': this.props.currentRoute.url
            // });
        }
    },
    render: function () {
        setTitle(this.props.title);

        var Handler = this.props.currentRoute.handler;

        return <Handler route={this.props.currentRoute} />
    }
});

Application = connectToStores(Application, ['MetaStore'], function (context) {
    return {
        title: context.getStore('MetaStore').getTitle()
    };
});
Application = handleHistory(Application);

module.exports = Application;
