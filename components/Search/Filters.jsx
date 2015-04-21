'use strict';

var React = require('react');
var _ = require('lodash');
var PriceFilter = require('./PriceFilter.jsx');
var RadiusFilter = require('./RadiusFilter.jsx');

var Filters = React.createClass({
    render: function () {
        return (
            <div className="sidebar">
                {this.renderCurrentFilters()}
                <h1>Affiner la recherche</h1>
                <section>
                    <form>
                    {this.renderRadius()}
                    {this.renderQ()}
                    {this.renderCategories()}
                    {this.renderPrice()}
                    </form>
                </section>
            </div>
        );
    },
    renderCurrentFilters: function () {
        var filters = _.map(this.props.search.categories, function (category) {
                return {
                    label   : category,
                    onChange: this.removeCategory.bind(this, category)
                }
        }, this);

        if (filters.length == 0) return;

        return (
            <section className="filter-recap">
                <h2>Ma sélection</h2>
                {_.map(filters, function (filter, i) {
                    return (
                        <label key={i+'#'+filter.label} className="checkbox-inline">
                            <input type="checkbox" align="baseline" checked onChange={filter.onChange} className="checkbox-disabled" />
                            <span></span>
                            {filter.label}
                        </label>
                    );
                }, this)}
            </section>
        );
    },
    renderRadius: function () {
        if (!this.props.search.location) return;

        return <RadiusFilter min={1000} max={50000} defaultValue={this.props.search.radius} onChange={this.handleRadiusChange} />;
    },
    renderPrice: function () {
        var min = 0, max = 1000;

        return <PriceFilter
            min={min}
            max={max}
            defaultMin={this.props.search.priceMin || min}
            defaultMax={this.props.search.priceMax || max}
            onChange={this.handlePriceChange} />;
    },
    renderQ: function () {
        if (!this.props.withQ) return;

        return (
            <div>
                <h2>Qui ?</h2>
                <div className="input-group">
                    <div className="input-group-addon"></div>
                    <input className="form-control" ref="query" type="text" defaultValue={this.props.search.q}
                        onChange={this.handleQueryChange}
                        onKeyDown={this.handleKey}
                        onKeyUp={this.handleKey}
                        onKeyPress={this.handleKey}/>
                    <div className="input-group-addon"><a href="#"></a></div>
                </div>
            </div>
        );
    },
    renderCategories: function () {
        var categories = this.props.categories || [];

        if (categories.length == 0) return;

        return (
            <div>
                <h2>Catégories</h2>
                {_.map(categories, function (category, i) {
                    var active   = this.props.search && (this.props.search.categories || []).indexOf(category) > -1;
                    var onChange = active ? this.removeCategory.bind(this, category) : this.addCategory.bind(this, category);

                    return (
                        <label key={category} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                            <span />
                            {category}
                        </label>
                    );
                }, this)}
            </div>
        );
    },
    addCategory: function (category) {
        this.props.onChange({categories: _.union(this.props.search.categories || [], [category])});
    },
    removeCategory: function (category) {
        this.props.onChange({categories: _.without(this.props.search.categories, category)});
    },
    handleQueryChange: _.debounce(function () {
        this.props.onChange({q: this.refs.query.getDOMNode().value});
    }, 500),
    handleKey: function (e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.props.onChange({q: this.refs.query.getDOMNode().value});
         }

    },
    handleRadiusChange: function (nextRadius) {
        this.props.onChange({radius: nextRadius});
    },
    handlePriceChange: function (nextPrice) {
        this.props.onChange({price: nextPrice});
    }
});

module.exports = Filters;
