'use strict';

var React = require('react');
var PublicLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var SearchUtils = require('../../lib/search-utils');
var Breadcrumb = require('./Breadcrumb.jsx');
var _ = require('lodash');

var Layout = React.createClass({
    componentDidMount: function () {
        $('body').on("click",'.trigger-filters',function(){
            if( jQuery('.mobile-filtres').css('top') != '85px' ) {
                TweenMax.to('.mobile-filtres', 0.4, {top:85,ease:Power2.easeInOut,onComplete:function(){
                    jQuery('body').toggleClass('locked');
                    jQuery('.mobile-filtres').addClass('opened');
                    jQuery('.trigger-filters').html('Enregistrer les filtres');
                }});
            } else if (jQuery('.mobile-filtres').hasClass('opened') ) {
                TweenMax.to('.mobile-filtres', 0.4, {top:'100%',ease:Power2.easeOut,onComplete:function(){
                    jQuery('body').toggleClass('locked');
                    jQuery('.mobile-filtres').removeClass('opened');
                    jQuery('.trigger-filters').html('Filtrer');
                }});
            }
        });
    },
    render: function () {
        return (
            <PublicLayout withSearchBar={true}>
                <div className="mobile-screen hidden-md hidden-lg">
                    <a role="button" className="btn-red trigger-filters btn-mobile-fixed">Filtres</a>
                </div>
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
                        <div className="col-md-4 col-sm-12 hidden-xs hidden-sm">
                            {this.props.filters}
                        </div>
                        <div className="main-content col-md-8 col-sm-12">
                            <section className="search-content">
                                {this.renderHeader()}
                                <div className="row">
                                    <div role="tabpanel" className="col-xs-12">
                                        <div className="row">
                                            {this.renderTabs()}
                                        </div>
                                        <div className="row"><p>&nbsp;</p></div>
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
    renderHeader: function () {
        var place = this.props.place || {};
        var search = this.props.search || {};
        var coverImage;

        if (place.picture) {
            coverImage = <img src={place.picture.url} alt={place.name} className="cover" />;
        }

        return (
            <div className="row">
                <div className="col-xs-12 header-part">
                    {coverImage}
                    <h3>{SearchUtils.searchToTitle(search, place, this.props.tab)}</h3>
                    <p>{SearchUtils.searchToDescription(search, place)}</p>
                </div>
            </div>
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
