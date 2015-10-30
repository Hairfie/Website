'use strict';

var React = require('react');
var _ = require('lodash');
var HairfieActions = require('../../actions/HairfieActions');
var Hairfie = require('../Partial/Hairfie.jsx');

var PAGE_SIZE = 12;

module.exports = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function() {
        if (_.isUndefined(this.props.page) || this.props.page < 0)
            return this.renderLoader();

        return (
            <div className="hairfies">
                <div className="row">
                    {this.props.similarHairfies.length > 0 ? <h3 className="col-xs-12 text-center">Hairfies Similaires</h3> : ''}
                    {_.map(this.props.similarHairfies, function (hairfie) {
                        return <Hairfie hairfie={hairfie} className="col-xs-6 col-sm-3 col-lg-2 single-hairfie" />;
                    })}
                </div>
                {this.renderMoreButton()}
            </div>
            );
    },
    renderLoader: function () {
        return (
            <div className="hairfies">
                <div className="row">
                    <div className="loading" />
                </div>
            </div>
        );
    },
    renderMoreButton: function () {
        if (this.props.page * PAGE_SIZE > this.props.similarHairfies.length) return;

        return <a role="button" onClick={this.loadMore} className="btn btn-red">Voir plus de Hairfies</a>;
    },
    loadMore: function (e) {
        if (e) e.preventDefault();
        this.context.executeAction(HairfieActions.loadSimilarHairfies, {
            hairfie: this.props.hairfie,
            page: (this.props.page || 0) + 1,
            pageSize: PAGE_SIZE
        });
    }
});