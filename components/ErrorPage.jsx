'use strict';

var React = require('react');

module.exports = React.createClass({
    contextTypes: {
        config: React.PropTypes.object
    },
    render: function () {
        return (
            <html>
                <head>
                    <title>Erreur {this.props.error.status || 500} - Hairfie</title>
                    {this.renderBody()}
                </head>
            </html>
        );
    },
    renderBody: function () {
        var message;
        if (404 == this.props.error.status) {
            message = <p>La page que vous avez demandée n'existe pas ou a été supprimée.</p>;
        }

        return (
            <body>
                <h1>Erreur {this.props.error.status || 500}</h1>
                {message}
                <p><a href="/">Retourner à l'accueil</a></p>
                {this.renderDebugInfos()}
            </body>
        );
    },
    renderDebugInfos: function () {
        if (!this.context.config.debug) return;

        return (
            <div>
                <h2>Stack trace</h2>
                <pre>{this.props.error.stack}</pre>
            </div>
        );
    }
});
