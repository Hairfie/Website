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
                <h4 style={{textAlign: 'center'}}>Affiner la recherche</h4>
                <section>
                    <form>
                    {this.renderRadius()}
                    {this.renderQ()}
                    {this.renderAddress()}
                    {this.renderCategories()}
                    {this.renderTags()}
                    {this.renderPrice()}
                    {this.renderDiscount()}
                    </form>
                </section>
            </div>
        );
    },
    renderCurrentFilters: function () {
        var search = this.props.search.categories || this.props.search.tags
        var filters = _.map(search, function (selection) {
                return {
                    label   : selection,
                    onChange: this.removeCategory.bind(this, selection)
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
                    <input className="form-control" ref="query" type="text" defaultValue={this.props.search.q}
                        onChange={this.handleQueryChange}
                        onKeyDown={this.handleQueryKey}
                        onKeyUp={this.handleQueryKey}
                        onKeyPress={this.handleQueryKey}/>
                    <div className="input-group-addon"><a role="button"></a></div>
                </div>
            </div>
        );
    },
    renderAddress: function() {
        if (!this.props.withQ) return;

        return (
            <div>
                <h2>Où ?</h2>
                <div className="input-group">
                    <div className="input-group-addon"></div>
                    <input className="form-control" ref="query" type="text" defaultValue={this.props.search.address}
                        onChange={this.handleAddressChange}
                        onKeyDown={this.handleAddressKey}
                        onKeyUp={this.handleAddressKey}
                        onKeyPress={this.handleAddressKey}/>
                    <div className="input-group-addon"><a role="button"></a></div>
                </div>
            </div>
        );
    },
    renderCategories: function () {
        if (!this.props.categories) return;

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
    renderDiscount: function () {
        if (!this.props.withQ) return;

        var withDiscount = (this.props.search && this.props.search.withDiscount) || false;
        var onChange = withDiscount ? this.removeWithDiscount : this.addWithDiscount;

        return (
            <div>
                <h2>Promotions</h2>
                <label className="checkbox-inline">
                    <input type="checkbox" align="baseline" onChange={onChange} checked={withDiscount} />
                    <span />
                    Avec une promotion
                </label>
            </div>
        );
    },
    renderTags: function ()
    {
        var tags = this.props.tags || [];
        if (!this.props.tags || tags.length == 0) return;

        return (
            <div>
                {_.map(this.props.tagCategories, function (category) {
                    var title = <h2>{category.name}</h2>;

                    var tagsInCategory = _.map(tags, function(tag) {
                        if (tag.category.id != category.id) return;
                        var active   = this.props.search && (this.props.search.tags || []).indexOf(tag.name) > -1;
                        var onChange = active ? this.removeTag.bind(this, tag.name) : this.addTag.bind(this, tag.name);

                        return (
                            <label key={tag.name} className="checkbox-inline">
                                <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                                <span />
                                {tag.name}
                            </label>
                        );
                    }, this);
                    tagsInCategory = _.compact(tagsInCategory);
                    if (_.isEmpty(tagsInCategory)) return;

                    return (
                        <div>
                            {title}
                            {tagsInCategory}
                        </div>);
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
    addTag: function (tag) {
        this.props.onChange({tags: _.union(this.props.search.tags || [], [tag])});
    },
    removeTag: function (tag) {
        this.props.onChange({tags: _.without(this.props.search.tags, tag)});
    },
    addWithDiscount: function () {
        this.props.onChange({withDiscount: true});
    },
    removeWithDiscount: function () {
        this.props.onChange({withDiscount: false});
    },
    handleQueryChange: _.debounce(function () {
        this.props.onChange({q: this.refs.query.getDOMNode().value});
    }, 500),
    handleQueryKey: function (e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.props.onChange({q: this.refs.query.getDOMNode().value});
         }
    },
    handleAddressChange: _.debounce(function () {
        this.props.onChange({address: this.refs.query.getDOMNode().value});
    }, 500),
    handleAddressKey: function (e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.props.onChange({address: this.refs.query.getDOMNode().value});
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
