'use strict';

var React = require('react');
var _ = require('lodash');

var ResultTopBar = React.createClass ({
    render: function() {
        console.log('RTB', this.props.result);

        var message, numResults;
        var numResults = this.props.kind == 'Hairfie' ? this.props.result.numHits : this.props.result.nbHits;
        var kind = numResults > 1 ? this.props.kind + 's' : this.props.kind;

        switch (numResults) {
            case 0:
                message = 'Nous n\'avons trouvé aucun ' + kind + ' correspondant à vos critères.';
                break;
            case 1:
                message = 'Nous avons trouvé 1 ' + kind + ' correspondant à vos critères';
                break;
            default:
                message = 'Quelle chance ! Nous avons trouvé ' + numResults + ' ' + kind + ' correspondant à vos critères.';
                break;
        }
        return (
            <div className="result-top-bar">
                {message}
            </div>
        );
    }
});

module.exports = ResultTopBar;
