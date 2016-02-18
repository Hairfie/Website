'use strict';

var React = require('react');
var _ = require('lodash');
var PriceFilter = require('./PriceFilter.jsx');
var RadiusFilter = require('./RadiusFilter.jsx');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PlaceActions = require('../../actions/PlaceActions');
var DateTimeConstants = require('../../constants/DateTimeConstants');

var MobileFilters = React.createClass({
    getInitialState: function () {
        return {
            filtersCategoryToDisplay: {},
            search: this.props.initialSearch
        };
    },
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    render: function () {
        // debugger;
        console.log('filtres', this.state.search);
        if(!this.props.shouldBeDisplayed) return null;
        return (
            <div className="new-filters">
                <SubFilters 
                    cat={this.state.filtersCategoryToDisplay} 
                    onClose={this.handleCloseMobileSubFilters} 
                    allFilters={this.props.allFilters} 
                    initialSearch={this.state.search}/>
                <h1>Filtrer par</h1>
                {_.map(this.props.filterCategories, function (category) {
                        return <a key={category.id} role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, category)}>{category.name}</a>
                    }.bind(this))}
                <button onClick={this.handleChange} className="btn btn-red">Valider</button>
                <button onClick={this.props.onClose} className="btn btn-red">Fermer</button>
            </div>
        );
    },
    handleChange: function () {
        console.log('handleChange');
        this.props.onChange(this.state.search);
    },
    handleDisplayMobileSubFilters: function(category) {
        this.setState({filtersCategoryToDisplay: category});
    },
    handleCloseMobileSubFilters: function(search) {
        this.setState({filtersCategoryToDisplay: {}});

        if(search) {

            this.setState({search:search});
        }
    }
});

var SubFilters = React.createClass ({
    getInitialState: function () {
        return {
            search: this.props.initialSearch,
            selectAll: false
        };
    },
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    render: function () {
        console.log("render", this.state);
        if(_.isEmpty(this.props.cat)) return null;
        return (
            <div className="new-filters subfilters"><h1>{'Catégorie :' + this.props.cat.name}</h1>
                <button onClick={this.handleClose} className="btn btn-red">Précédent</button>
                <br/>
                    {_.map(_.groupBy(this.props.allFilters, 'category.id')[this.props.cat.id], function (filter) {
                        return (
                            <div key={filter.id} className="filter-line">
                                <label className="checkbox-inline">
                                    <input type="checkbox"
                                        ref={filter.id}
                                        value={filter.name}
                                        checked={this.isSearched(filter)}
                                        onChange={this.handleFilterChange} />
                                    {filter.name}
                                </label>
                            </div>
                        )
                    }, this)}
                <br/>
                <button onClick={this.selectAll} className="btn btn-red">Tout sélectionner</button>
                <br/>
                <button onClick={this.handleClose} className="btn btn-red">Valider</button>
            </div>
        );
    },
    isSearched: function (filter) {
        return (_.indexOf(this.state.search.tags, filter.name) > -1 ? true : false);
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
            console.log('handleClose', this.state.search);

    },
    handleFilterChange: function (e) {
        var newTags = this.state.search.tags;

        if (e.currentTarget.checked === true){
            newTags.push(e.currentTarget.value);
            this.setState({search: _.assign({}, this.state.search, {tags: newTags})});
        }
        else {
            this.setState({search: _.assign({}, this.state.search, {tags:  _.without(newTags, e.currentTarget.value)})});
        }
        console.log('handleFilterChange', this.state.search);

    },
    selectAll: function () {
        if (!this.state.selectAll){
            var newTags = this.state.search.tags;
            newTags = newTags.concat(_.map(_.groupBy(this.props.allFilters, 'category.id')[this.props.cat.id], function (filter) {
                return filter.name }, this));

            this.setState({search: {tags: newTags}});
        } else {
            var currentTags = _.map(_.groupBy(this.props.allFilters, 'category.id')[this.props.cat.id], function (filter) {
                return filter.name }, this);
            var newTags = _.filter(this.state.search.tags, function(tag) {
                return !_.include(currentTags, tag)});
            this.setState({search: {tags: newTags}});
        }
        this.setState({selectAll: !this.state.selectAll});
    }
});

module.exports = MobileFilters;
