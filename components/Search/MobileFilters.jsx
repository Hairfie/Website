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
            filtersCategoryToDisplay: {}
        };
    },
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    render: function () {
        debugger;
        if(!this.props.shouldBeDisplayed) return null;
        return (
            <div className="new-filters">
                <SubFilters 
                    cat={this.state.filtersCategoryToDisplay} 
                    onClose={this.handleDisplayMobileSubFilters.bind(this, {})} 
                    filters={this.props.allFilters} 
                    search={this.props.search}/>
                <h1>Filtrer par</h1>
                {_.map(this.props.filterCategories, function (category) {
                        return <a key={category.id} role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, category)}>{category.name}</a>
                    }.bind(this))}
                <button onClick={this.props.onClose} className="btn btn-red">Fermer</button>
            </div>
        );
    },
    handleDisplayMobileSubFilters: function(category) {
        this.setState({filtersCategoryToDisplay: category});
    }
});

var SubFilters = React.createClass ({
    getInitialState: function () {
        return {
            filtersToSearch: this.props.search.tags,
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
                <button onClick={this.props.onClose} className="btn btn-red">Précédent</button>
                <br/>
                    {_.map(_.filter(this.props.filters, 'category', this.props.cat), function (filter) {
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
                <button onClick={this.selectAll} className="btn btn-red">Valider</button>
            </div>
        );
    },
    isSearched: function (filter) {
        return (_.indexOf(this.state.filtersToSearch, filter.name) > -1 ? true : false);
    },
    handleFilterChange: function (e) {
        if (e.currentTarget.checked === true){
            var newTags = this.state.filtersToSearch;
            newTags.push(e.currentTarget.value);
            this.setState({filtersToSearch: newTags});
        }
        else {
            var newTags = this.state.filtersToSearch;
            this.setState({filtersToSearch: _.without(newTags, e.currentTarget.value)});
        }
    },
    selectAll: function () {
        this.setState({selectAll: !this.state.selectAll});
        debugger;
    }
});

module.exports = MobileFilters;
