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
                    <title>Erreur {this.getStatusCode()} - Hairfie</title>
                    {this.renderBody()}
                </head>
            </html>
        );
    },
    renderBody: function () {
        var message;
        if (404 == this.getStatusCode()) {
            message = <p>La page que vous avez demandée n'existe pas ou a été supprimée.</p>;
        }

        return (
            <body>
                <h1>Erreur {this.getStatusCode()}</h1>
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
    },
    getStatusCode: function () {
        return this.props.error.status || this.props.error.statusCode || 500;
    }
});
