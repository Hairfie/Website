/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var HairfieStore = require('../../stores/HairfieStore');
var NavLink = require('flux-router-component').NavLink;
var Picture = require('../Partial/Picture.jsx');
var moment = require('moment');
var _ = require('lodash');

require('moment/locale/fr');
moment.locale('fr');

var PAGE_SIZE = 8;

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [HairfieStore]
    },
    getPageHairfies: function (page, createdBefore) {
        var where = {};
        where.businessId = this.props.businessId;
        if (createdBefore) {
            where.createdAt = {lte: createdBefore};
        }

        return this.getStore(HairfieStore).query({
            where: where,
            sort: 'createdAt DESC',
            limit: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE
        });
    },
    getStateFromStores: function (props) {
        var props = props || this.props;
        var oldState = this.state || {};
        var page = oldState.page || 1;
        var createdAfter = oldState.hairfies && oldState.hairfies[1] && oldState.hairfies[1].createdAt;

        var loading   = false;
        var endOfList = false;
        var hairfies  = [];
        for (var i = 1; i <= page; i++) {
            var pageHairfies = this.getPageHairfies(page);
            if (_.isUndefined(pageHairfies)) loading = true;
            else if (pageHairfies.length < PAGE_SIZE) endOfList = true;
            hairfies = _.union(hairfies, pageHairfies);
        }

        return {
            hairfies: hairfies,
            loading: loading,
            endOfList: endOfList
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
        if (!this.state.hairfies && this.state.loading) {
            return this.renderTextOnly('Chargment en cours, veuillez patienter...');
        }

        if (!this.state.hairfies.length && !this.state.loading) {
            return this.renderTextOnly('Pas encore de hairfie de ce coiffeur.');
        }

        return (
            <section>
                <h3>Nos Hairfies</h3>
                <div className="salon-hairfies hairfies">
                    <div className="row">
                        {_.map(this.state.hairfies, function (hairfie) {
                            return (
                                <div key={hairfie.id} className="col-md-3 single-hairfie">
                                    <figure>
                                        <NavLink context={this.props.context} routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                                            <Picture picture={hairfie.pictures[0]}
                                                  resolution={{width: 640, height: 640}}
                                                         alt="" />
                                        </NavLink>
                                        <figcaption>
                                            <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                        </figcaption>
                                    </figure>
                                </div>
                            );
                        }, this)}
                    </div>
                </div>
            </section>
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
    },
    loadMore: function () {
        this.setState({page: this.state.page + 1});
        this.setState(this.getStateFromStores());
    }
});
