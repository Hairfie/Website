'use strict';

var React = require('react');
var _ = require('lodash');
var PublicLayout = require('../PublicLayout.jsx');
var NavLink = require('flux-router-component').NavLink;
var SearchUtils = require('../../lib/search-utils');

var Breadcrumb = React.createClass({
    render: function () {
        var crumbs = [];
        var place  = this.props.place;

        while (place) {
            crumbs.unshift({
                id: place.id,
                last: crumbs.length == 0,
                label: (place.name || '').split(',')[0],
                routeName: 'business_search',
                navParams: {
                    address: SearchUtils.addressToUrlParameter(place.name)
                }
            });
            place = place.parent;
        }

        crumbs.unshift({
            id: 'home',
            last: false,
            label: 'Accueil',
            routeName: 'home',
            navParams: {}
        });

        return (
            <div className="col-xs-12 hidden-xs hidden-sm">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb) {
                        if (crumb.last) {
                            return (
                                <li key={crumb.id} className="active">
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li key={crumb.id}>
                                    <NavLink context={this.props.context} routeName={crumb.routeName} navParams={crumb.navParams}>
                                        {crumb.label}
                                    </NavLink>
                                </li>
                            );
                        }
                    }, this)}
                </ol>
            </div>
        );
    }
});

module.exports = React.createClass({
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
                    <a href="#" className="btn-red trigger-filters btn-mobile-fixed">Filtres</a>
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
        var coverImage;

        if (place.picture) {
            coverImage = <img src={place.picture.url} alt={place.name} className="cover" />;
        }

        return (
            <div className="row">
                <div className="col-xs-12 header-part">
                    {coverImage}
                    <h3>{(place.name || '').split(',')[0]}</h3>
                    <p>{place.description}</p>
                </div>
            </div>
       );
    },
    renderTabs: function () {
        var address = SearchUtils.addressToUrlParameter(this.props.address);

        return (
            <ul className="nav nav-tabs">
                <li className={'col-xs-6'+(this.props.tab == 'business' ? ' active' : '')}>
                    <NavLink routeName="business_search" navParams={{address: address}}>
                        <span className="icon-nav" />
                        Coiffeurs
                    </NavLink>
                </li>
                <li className={'col-xs-6'+(this.props.tab == 'hairfie' ? ' active' : '')}>
                    <span className="icon-nav" />
                    <NavLink routeName="hairfie_search_result" navParams={{address: address}}>
                        Hairfies
                    </NavLink>
                </li>
            </ul>
        );
    }
});
