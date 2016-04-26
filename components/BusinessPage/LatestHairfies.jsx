'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var Hairfie = require('../Partial/Hairfie.jsx');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var businessAccountTypes = require('../../constants/BusinessAccountTypes');
var HairfieActions = require('../../actions/HairfieActions');
var Button = require('react-bootstrap').Button;

var PAGE_SIZE = 4;

var LatestHairfies = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        if (!this.props.business || (_.isArray(this.props.hairfies) && _.isEmpty(this.props.hairfies))) return null;
        else if (this.props.business.accountType == businessAccountTypes.FREE) return this.renderLatestHairfies();
        else return this.renderLatestBusinessHairfies();
    },
    renderLatestHairfies: function () {
        var hairfies = this.props.hairfies;
        if (_.isArray(hairfies)) {
            hairfies = _.slice(hairfies, 0, PAGE_SIZE);
        }

        return (
            <section className="latestHairfie">
                <h3>Les derniers hairfies</h3>
                <div className="hairfies">
                    {hairfies == -1 ? this.renderLoader() : _.map(hairfies, function (hairfie) {
                        return <Hairfie className="col-xs-6 col-sm-3 single-hairfie" key={hairfie.id} hairfie={hairfie} />;
                    })}
                    <Link route="hairfie_search" params={{ address: 'France'}} 
                    className="more col-xs-8 col-xs-offset-2 col-sm-4 col-sm-offset-4"> En voir +</Link>
                </div>
            </section>
        );
    },
    renderLatestBusinessHairfies: function() {
        var business = this.props.business || {};

        var hairfies = this.props.hairfies;
        if (_.isArray(hairfies)) {
            hairfies = _.slice(hairfies, 0, PAGE_SIZE);
        }

        return (
            <section className="latestHairfie">
                <h3>Les derniers hairfies de ce salon de coiffure</h3>
                <div className="hairfies">
                    {hairfies == -1 ? this.renderLoader() : _.map(hairfies, function (hairfie) {
                        return <Hairfie className="col-xs-6 col-sm-3 single-hairfie" key={hairfie.id} hairfie={hairfie} />;
                    })}
                    <Link Link route="business_hairfies" params={{ businessId: business.id, businessSlug: business.slug }} 
                    className="more col-xs-8 col-xs-offset-2 col-sm-4 col-sm-offset-4"> En voir +</Link>
                </div>
            </section>
        );
    },
    renderLoader: function () {
        return (
            <div className="row">
                <div className="loading" />
            </div>
        );
    }
});

LatestHairfies = connectToStores(LatestHairfies, [
    'HairfieStore',
], function (context, props) {
    var hairfies = null;
    if (!props.business) hairfies = null;
    else if (props.business.accountType == businessAccountTypes.FREE) hairfies = context.getStore('HairfieStore').getTop();
    else hairfies = context.getStore('HairfieStore').getBusinessTop(props.business.id);

    return _.assign({}, {
        hairfies: _.compact(hairfies)
    }, props);
});

module.exports = LatestHairfies;