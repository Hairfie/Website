'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Layout = require('./BusinessPage/Layout.jsx');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }
function initials(u) { var u = u || {}; return (u.firstName || '').substr(0, 1)+(u.lastName || '').substr(0, 1); }

var BusinessReviewPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        if ((this.props.reviews || []).length == 0) {
            return (
                <Layout business={this.props.business} tab="reviews">
                    <p className="text-center">
                        <br /><br />
                        Pas encore d'avis sur ce coiffeur.
                        <br /><br />
                    </p>
                </Layout>
            );
        }

        return (
            <Layout business={this.props.business} tab="reviews">
            {this.renderForm()}
                <div className="comments">
                    {_.map(this.props.reviews, function (review) {
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
            </Layout>
        );
    },
    renderForm: function() {
        return(
            <form>
                <input type="textarea" ref="comment" />
                <a className="btn" onClick={this.submit} />
            </form>
            );
    },
    submit: function(e) {
        e.preventDefault();
    }
});

BusinessReviewPage = connectToStores(BusinessReviewPage, [
    'BusinessStore',
    'BusinessReviewStore'
], function (context, props) {
    return {
        business: context.getStore('BusinessStore').getById(props.route.params.businessId),
        reviews: context.getStore('BusinessReviewStore').getLatestByBusiness(props.route.params.businessId)
    };
});

module.exports = BusinessReviewPage;
