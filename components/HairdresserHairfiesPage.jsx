'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairdresserLayout = require('./HairdresserPage/Layout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');

var HairdresserHairfiesPage = React.createClass({
    render: function () {
        console.log(this.props.hairdresser);
        return(
            <HairdresserLayout hairdresser={this.props.hairdresser} tab="hairfies">
            </HairdresserLayout>
        );
    }
});

HairdresserHairfiesPage = connectToStores(HairdresserHairfiesPage, [
    'HairdresserStore'
], function (context, props) {
    return {
        hairdresser: context.getStore('HairdresserStore').getById(props.route.params.id)
    };
});

module.exports = HairdresserHairfiesPage;