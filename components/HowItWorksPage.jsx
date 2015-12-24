'use strict';

var React = require('react');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Link = require('./Link.jsx');

var HowItWorksPage = React.createClass({
    render: function() {
        return (
            <PublicLayout>
                <div className="">
                    <h1>Comment ça marche ?</h1>
                    <p>Blabla</p>
                </div>
            </PublicLayout>
        );
    }
});

module.exports = HowItWorksPage;