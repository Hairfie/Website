/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessReviewStore = require('../../stores/BusinessReviewStore');
var moment = require('moment');
var _ = require('lodash');

moment.locale('fr_FR');

function displayName(n) {
    return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.'
}

function initials(n) {
    return (n.firstName || '').substr(0, 1)+''+(n.lastName || '').substr(0, 1)
}

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessReviewStore]
    },
    getStateFromStores: function (props) {
        var props = props || this.props;

        return {
            reviews: this.getStore(BusinessReviewStore).getLatestByBusiness(props.businessId, 50)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    render: function () {
        var reviews = this.state.reviews;

        if (_.isUndefined(reviews)) return this.renderTextOnly('Chargement en cours, veuillez patienter...');
        if (reviews.length == 0) return this.renderTextOnly('Pas encore d\'avis sur ce coiffeur.');

        return (
            <div className="comments">
                {_.map(reviews, function (review) {
                    return (
                        <div className="single-comment col-xs-12">
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
