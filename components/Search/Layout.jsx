'use strict';

var React = require('react');
var PublicLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var SearchUtils = require('../../lib/search-utils');
var Breadcrumb = require('../Partial/Breadcrumb.jsx');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var MobileFilters = require('./MobileFilters.jsx');
var ReactDOM = require('react-dom');
var HairfieActions = require('../../actions/HairfieActions');
var Header = require('./Header.jsx');

var Layout = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            displayMobileFilters: false
        };
    },
    render: function () {
        return (
            <PublicLayout withSearchBar={true}>
                {this.props.children}

                <div className="container search" id="content">
                    <div className="mobile-search visible-sm visible-xs">
                        <div className="mobile-filtres">
                            <div className="col-xs-12">
                                {this.props.filters}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <Breadcrumb place={this.props.place} />
                        <div className="col-md-4 col-sm-12 hidden-xs hidden-sm" style={{paddingRight: 30}}>
                            {this.props.filters}
                            {this.props.topReviews}
                        </div>
                        <div className="col-xs-12 visible-xs visible-sm">
                            {this.props.mobileFilters}

                        </div>
                        <div className="main-content col-md-8 col-sm-12">
                            <section className="search-content">
                                <Header search={this.props.search} tab={this.props.tab} place={this.props.place} selections={this.props.selections} />
                                <div className="row">
                                    <div role="tabpanel">
                                        <div className="row">
                                            {/*this.renderTabs()*/}
                                        </div>
                                        <div className="tab-content">
                                            {this.props.results}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    renderTabs: function () {
        var address = SearchUtils.addressToUrlParameter(this.props.address);

        return (
            <ul className="nav nav-tabs">
                <li className={'col-xs-6'+(this.props.tab == 'business' ? ' active' : '')}>
                    <Link route="business_search" params={{ address: address }} query={this.props.query && this.props.query.categories ? {categories: this.props.query.categories} : {}}>
                        <span className="icon-nav" />
                        Coiffeurs
                    </Link>
                </li>
                <li className={'col-xs-6'+(this.props.tab == 'hairfie' ? ' active' : '')}>
                    <Link route="hairfie_search" params={{ address: address }} query={this.props.query && this.props.query.tags ? {tags: this.props.query.tags} : {}}>
                        <span className="icon-nav" />
                        Hairfies
                    </Link>
                </li>
            </ul>
        );
    }
});

module.exports = Layout;
