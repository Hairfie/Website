'use strict';

var React = require('react');
var connectToStores = require('../lib/connectToStores');

var PageProgress = React.createClass({
    render: function () {
        if (!this.props.loading) return <div />;

        var style = {
            display: 'inline-block',
            backgroundColor: '#fc5a5f',
            position: 'fixed',
            zIndex: 100,
            top: 0,
            left: 0,
            width: '100%',
            maxWidth: '100% !important',
            height: '2px',
            boxShadow: '1px 1px 1px rgba(0,0,0,0.4)',
            borderRadius: '0 1px 1px 0',
            WebkitTransition: '.4s width, .4s background-color',
            transition: '.4s width, .4s background-color'
        };

        return <div style={style} />;
    }
});

PageProgress = connectToStores(PageProgress, ['RouteStore'], function (stores) {
    return {
        loading: !stores.RouteStore.isNavigateComplete()
    };
});

module.exports = PageProgress;
