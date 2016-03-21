'use strict';

var React = require('react');
var _ = require('lodash');

var SearchLabels = React.createClass ({
    render: function() {
        console.log('SearchLabels.search', this.props.search);
        return (
            <div>
                {this.renderSelectionsLabels()}{this.renderCategoriesLabels()}
            </div>
        );
    },
    renderCategoriesLabels: function() {
        if (!this.props.search.categories) return null;
        return (
            <div style={{display: 'inline-block'}}>
                {_.map(this.props.searchedCategories, function(cat) {
                    return (
                        <span key={cat.id} className="business-label" onClick={this.removeCategory.bind(this, cat)}>{cat.label}&times;</span>
                    );
                }, this)}
            </div>
        );
    },
    removeCategory: function (category) {
        this.props.onChange({categories: _.without(this.props.search.categories, category.slug)});
    },
    renderSelectionsLabels: function() {
        if (!this.props.search.selections) return null;
        return (
            <div style={{display: 'inline-block'}}>
                {_.map(this.props.searchedSelections, function(selection){
                    return (
                        <span key={selection.id} className="business-label" onClick={this.removeSelection.bind(this, selection.slug)}>{selection.label}&times;</span>
                    );
                }, this)}
            </div>
        ); 
    },
    removeSelection: function (selectionSlug) {
        this.props.onChange({selections: _.without(this.props.search.selections, selectionSlug)});
    }
});

module.exports = SearchLabels;
