'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairdresserLayout = require('./HairdresserPage/Layout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');

var HairdresserPage = React.createClass({
    render: function () {
        return(
            <HairdresserLayout hairdresser={this.props.hairdresser} tab="infos">
            </HairdresserLayout>
        );
    }
});

HairdresserPage = connectToStores(HairdresserPage, [
    'HairdresserStore'
], function (context, props) {
    return {
        hairdresser: context.getStore('HairdresserStore').getById(props.route.params.id)
    };
});

module.exports = HairdresserPage;