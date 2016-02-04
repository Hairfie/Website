'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="loading-container" >
                <span className="loading" />
                <span>Chargement...</span>
            </div>
        )
    }
});
