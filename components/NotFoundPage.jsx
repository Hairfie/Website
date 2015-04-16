'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');


module.exports = React.createClass({
    render: function () {
        return (
            <PublicLayout>
                <h3>Malheureusement, la page que vous avez demandée n'existe plus</h3>
                <p>Mais rassurez-vous, il y a tout le reste de Hairfie pour trouver votre bonheur !</p>
            </PublicLayout>
        );
    }
});
