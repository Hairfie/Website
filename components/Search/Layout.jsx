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

var Layout = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            displayMobileFilters: false,
            isExpanded: false
        };
    },
    /*componentDidMount: function () {
        $('body').on("click",'.trigger-filters',function() {
            console.log("click !");
            if( jQuery('.mobile-filtres').css('top') != '65px' ) {
                TweenMax.to('.mobile-filtres', 0.2, {top:65,ease:Power2.easeInOut, onComplete:function(){
                    jQuery('body').toggleClass('locked');
                    jQuery('.mobile-filtres').addClass('opened');
                    jQuery('.menu-trigger').addClass('close filters');
                    jQuery('.trigger-filters').html('Enregistrer les filtres');
                }});
            } else if (jQuery('.mobile-filtres').hasClass('opened') ) {
                TweenMax.to('.mobile-filtres', 0.2, {top:'100%',ease:Power2.easeOut, onComplete:function(){
                    jQuery('body').toggleClass('locked');
                    jQuery('.mobile-filtres').removeClass('opened');
                    jQuery('.menu-trigger').removeClass('close filters');
                    jQuery('.trigger-filters').html('Filtrer');
                }});
            }
        });
        $('body').on("click",'.menu-trigger',function() {
            if (jQuery('.mobile-filtres').hasClass('opened') ) {
                TweenMax.to('.mobile-filtres', 0.2, {top:'100%',ease:Power2.easeOut, onComplete:function(){
                    jQuery('body').removeClass('locked');
                    jQuery('.mobile-filtres').removeClass('opened');
                    jQuery('.menu-trigger').removeClass('close filters');
                    jQuery('.trigger-filters').html('Filtrer');
                }});
            }
        });
    },
    componentWillUnmount: function() {
        $('body').removeClass('locked');
    },*/    
    render: function () {
            console.log("render layout", this.props.search);

        return (
            <PublicLayout withSearchBar={true}>
                {this.props.children}
                <div className="mobile-screen hidden-md hidden-lg">
                    {/*<a role="button" className="btn-red trigger-filters btn-mobile-fixed">Filtres</a>*/}
                    <a role="button" className="btn-red btn-mobile-fixed" onClick={this.handleDisplayMobileFilters}>Filtres</a>
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
                        <Breadcrumb searchedPlace={this.props.place} />
                        <div className="col-md-4 col-sm-12 hidden-xs hidden-sm">
                            {this.props.filters}
                        </div>
                        <div className="main-content col-md-8 col-sm-12">
                            <section className="search-content">
                                <MobileFilters 
                                    onClose={this.handleDisplayMobileFilters} 
                                    shouldBeDisplayed={this.state.displayMobileFilters} 
                                    allFilters = {this.props.allFilters}
                                    filterCategories = {this.props.filterCategories}
                                    initialSearch={this.props.search}
                                    onChange={this.handleSearchChange} /> 

                                {this.renderHeader()}
                                <div className="row">
                                    <div role="tabpanel" className="bg-white-xs">
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
    handleDisplayMobileFilters: function() {
        if(this.state.displayMobileFilters == false)
            $('body').toggleClass('locked');
        else
            $('body').removeClass('locked');
        this.setState({displayMobileFilters: (!this.state.displayMobileFilters)});
    },
    handleSearchChange: function (nextSearch) {
        this.handleDisplayMobileFilters();
        this.context.executeAction(HairfieActions.submitSearch, nextSearch);
    },
    renderHeader: function () {
        var place = this.props.place || {};
        var search = this.props.search || {};
        var coverImage, btnExpand, descriptionNodeDesktop, descriptionNodeMobile;

        if(!_.isEmpty(SearchUtils.searchToDescription(search, place))) {
            var btnExpand = <span className={this.state.isExpanded ? 'btn-expand hidden' : 'btn-expand'} ref="expand" onClick={this.expandText}>...</span>;

            var description = SearchUtils.searchToDescription(search, place);
            if (!this.state.isExpanded) {
                description = _.trunc(description, {
                    'length': 120,
                    'separator': ' ',
                    'omission': ' '
                });
            }

            descriptionNodeDesktop =  <p ref="description" className="hidden-xs">{SearchUtils.searchToDescription(search, place)}</p>

            descriptionNodeMobile = (<span ref="description" className="visible-xs mobile-description">
                    {description}
                    {btnExpand}
                </span>);
        }

        if (place.picture) {
            coverImage = <Picture picture={{url: place.picture.url}} alt={place.name} className="cover" />;
        }
        
        return (
            <div className="row">
                <div className="col-xs-12 header-part">
                    {coverImage}
                    <h1>{SearchUtils.searchToTitle(search, place, this.props.tab, this.props.categories)}</h1>
                    {descriptionNodeDesktop}
                    {descriptionNodeMobile}
                </div>
            </div>
       );
    },
    expandText: function (e) {
        this.setState({isExpanded: true});
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
