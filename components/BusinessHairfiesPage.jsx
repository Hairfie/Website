'use strict';

var React = require('react');
var _ = require('lodash');
var Layout = require('./BusinessPage/Layout.jsx');
var HairfieActions = require('../actions/HairfieActions');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Hairfie = require('./Partial/Hairfie.jsx');

var PAGE_SIZE = 12;

var BusinessHairfiesPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            page: 1
        };
    },
    render: function () {
        if ((this.props.hairfies || []).length == 0) {
            return (
                <Layout business={this.props.business} tab="hairfies">
                    <p className="text-center">
                        <br /><br />
                        Pas encore de hairfie de ce coiffeur.
                        <br /><br />
                    </p>
                </Layout>
            );
        }

        return (
            <Layout business={this.props.business} tab="hairfies">
                {this.renderHairfie()}
                {this.renderAveragePrice()}
            </Layout>
        );
    },
    renderAveragePrice: function() {
        var averagePrice = this.props.business && this.props.business.averagePrice;
        if (!averagePrice || (!averagePrice.men && !averagePrice.women)) return null;

        return (
            <section>
                <h3>Prix moyen constaté</h3>
                <p className="title">Sur les hairfies du salon</p>
                <div className="row average-price">
                    <div className={"col-xs-6 col-sm-6 pull-right" + (averagePrice.women ? '' : ' hide')}>
                        <div className="gender">
                            FEMME
                        </div>
                        <div className="price">
                            <span>{parseInt(averagePrice.women) + '€'}</span>
                        </div>
                    </div>
                    <div className={"col-xs-6 col-sm-6 pull-right" + (averagePrice.men ? '' : ' hide')}>
                        <div className="gender">
                            HOMME
                        </div>
                        <div className="price">
                            <span>{parseInt(averagePrice.men) + '€'}</span>
                        </div>
                    </div>
                </div>
            </section>
        );

    },
    renderHairfie: function() {
        var hairfies = _.take(this.props.hairfies, this.state.page * PAGE_SIZE);

        return (
            <section>
                <h3>Nos Hairfies</h3>
                <div className="hairfies">
                    <div className="row">
                        {_.map(hairfies, function (hairfie) {
                            return <Hairfie hairfie={hairfie} className="col-xs-6 col-md-3 single-hairfie" popup={true} hairfies={_.map(hairfies, 'id')}/>;
                        })}
                    </div>
                    {this.renderMoreButton()}
                </div>
            </section>
        );
    },
    renderMoreButton: function () {
        if (this.state.page * PAGE_SIZE > this.props.hairfies.length) return;

        return <a href="#" onClick={this.loadMore} className="btn btn-red">Voir plus de Hairfies</a>;
    },
    loadMore: function (e) {
        e.preventDefault();
        var nextPage = this.state.page + 1;
        this.setState({ page: nextPage });
        this.context.executeAction(HairfieActions.loadBusinessHairfies, {
            businessId: this.props.business.id,
            page: nextPage,
            pageSize: PAGE_SIZE
        });
    }
});

BusinessHairfiesPage = connectToStores(BusinessHairfiesPage, [
    'BusinessStore',
    'HairfieStore'
], function (context, props) {
    return {
        business: context.getStore('BusinessStore').getById(props.route.params.businessId),
        hairfies: context.getStore('HairfieStore').getByBusiness(props.route.params.businessId),
    };
});

module.exports = BusinessHairfiesPage;
