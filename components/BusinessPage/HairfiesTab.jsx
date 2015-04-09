/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var HairfieStore = require('../../stores/HairfieStore');
var NavLink = require('flux-router-component').NavLink;
var Picture = require('../Partial/Picture.jsx');
var moment = require('moment');
var _ = require('lodash');

require('moment/locale/fr');
moment.locale('fr');

var PAGE_SIZE = 8;

function displayName(n) {
    return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.';
}

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
            order: 'createdAt DESC',
            limit: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE
        });
    },
    getStateFromStores: function (props, page) {
        var props = props || this.props;
        var oldState = this.state || {};
        var page = page || oldState.page || 1;
        var createdAfter = oldState.hairfies && oldState.hairfies[1] && oldState.hairfies[1].createdAt;

        var loading   = false;
        var endOfList = false;
        var hairfies  = [];
        for (var i = 1; i <= page; i++) {
            var pageHairfies = this.getPageHairfies(i);
            if (_.isUndefined(pageHairfies)) loading = true;
            else if (pageHairfies.length < PAGE_SIZE) endOfList = true;
            hairfies = _.union(hairfies, pageHairfies);
        }

        return {
            page: page,
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
                            var hairdresser = <p>&nbsp;</p>;
                            if (hairfie.hairdresser) {
                                hairdresser = <p>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                            }

                            var price;
                            if (hairfie.price) {
                                price = <div className="pricetag">{hairfie.price.amount}€</div>;
                            }

                            return (
                                <div key={hairfie.id} className="col-md-3 single-hairfie">
                                    <figure>
                                        <NavLink context={this.props.context} routeName="show_hairfie" navParams={{hairfieId: hairfie.id}}>
                                            <Picture picture={hairfie.pictures[0]}
                                                  resolution={{width: 640, height: 640}}
                                                 placeholder="/images/placeholder-640.png"
                                                         alt="" />

                                            <figcaption>
                                                {hairdresser}
                                                <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                                {price}
                                            </figcaption>
                                        </NavLink>
                                    </figure>
                                </div>
                            );
                        }, this)}
                    </div>
                    {this.renderMoreButton()}
                </div>
            </section>
        );
    },
    renderMoreButton: function () {
        if (this.state.endOfList) return;

        if (this.state.loading) {
            return <a className="btn btn-red">Chargment...</a>;
        }

        return <a href="#" onClick={this.loadMore} className="btn btn-red">Voir plus de Hairfies</a>;
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
    loadMore: function (e) {
        e.preventDefault();
        this.setState(this.getStateFromStores(this.props, this.state.page + 1));
    }
});
