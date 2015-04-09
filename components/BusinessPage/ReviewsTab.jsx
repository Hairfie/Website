/** @jsx React.DOM */

'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');

// NOTE: it is necessary to require the language before using it
//       because otherwise it is not included in the build file
require('moment/locale/fr');
moment.locale('fr');

function displayName(n) {
    return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.'
}

function initials(n) {
    return (n.firstName || '').substr(0, 1)+''+(n.lastName || '').substr(0, 1)
}

module.exports = React.createClass({
    render: function () {
        var reviews = this.props.reviews || [];

        if (_.isUndefined(reviews)) return this.renderTextOnly('Chargement en cours, veuillez patienter...');
        if (reviews.length == 0) return this.renderTextOnly('Pas encore d\'avis sur ce coiffeur.');

        return (
            <div className="comments">
                {_.map(reviews, function (review) {
                    return (
                        <div key={review.id} className="single-comment col-xs-12">
                            <span className="user-profil col-xs-1">
                                <img src={'http://placehold.it/40&text='+initials(review)} alt={'Photo de '+displayName(review)} />
                            </span>
                            <div className="col-xs-8">
                                <p><strong>Note : {Math.round(review.rating / 100 * 5)}/5</strong></p>
                                <p>{review.comment}</p>
                                <div className="by-when">
                                    {displayName(review)} - {moment(review.createdAt).format('LL')}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    },
    renderTextOnly: function (text) {
        return (
            <p className="text-center">
                <br />
                <br />
                <br />
                <br />
                <em>{text}</em>
                <br />
                <br />
                <br />
                <br />
            </p>
        );
    }
});
