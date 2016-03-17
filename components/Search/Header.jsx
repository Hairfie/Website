'use strict'

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var SearchUtils = require('../../lib/search-utils');

var Header = React.createClass({
    getInitialState: function () {
        return {
            isExpanded: false
        };
    },
    render: function () {
        var place = this.props.place || {};
        var search = this.props.search || {};
        var coverImage, btnExpand, descriptionNodeDesktop, descriptionNodeMobile;
        var description = SearchUtils.searchToDescription(search, place, this.props.currentRoute.url);
        var mobileDescription = description;

        if(description) {
            var btnExpand = <span className={this.state.isExpanded ? 'btn-expand hidden' : 'btn-expand'} ref="expand" onClick={this.expandText}>...</span>;

            if (!this.state.isExpanded) {
                mobileDescription = _.trunc(description, {
                    'length': 120,
                    'separator': ' ',
                    'omission': ' '
                });
            }

            descriptionNodeDesktop =  <p ref="description" className="hidden-xs">{description}</p>

            descriptionNodeMobile = (<span ref="description" className="visible-xs mobile-description">
                    {mobileDescription}
                    {btnExpand}
                </span>);
        }

        if (place.picture) {
            coverImage = <Picture picture={{url: place.picture.url}} alt={place.name} className="cover" />;
        }

        var title;
        if(this.props.tab == "business") {
            title = SearchUtils.businessSearchToTitle(search, place, this.props.currentRoute.url, this.props.categories);
        } else if(this.props.tab == "hairfie") {
            title = SearchUtils.hairfieSearchToTitle(search, place, this.props.currentRoute.url);
        }

        return (
            <div className="row">
                <div className="col-xs-12 header-part">
                    {coverImage}
                    <h1>{title}</h1>
                    {descriptionNodeDesktop}
                    {descriptionNodeMobile}
                </div>
            </div>
       );
    },
    expandText: function (e) {
        this.setState({isExpanded: true});
    }
});

var Header = connectToStores(Header, [
    'PlaceStore',
    'CategoryStore',
    'TagStore',
    'RouteStore'
], function (context, props) {
    return {
        timeslots : context.getStore('TimeslotStore').getById(props.businessId),
        tags: context.getStore('TagStore').getAllTags(),
        categories: context.getStore('CategoryStore').getAllCategories(),
        currentRoute: context.getStore('RouteStore').getCurrentRoute()
    };
});

module.exports = Header;
