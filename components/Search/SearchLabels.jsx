'use strict';

var React = require('react');
var _ = require('lodash');
var DateTimeConstants = require('../../constants/DateTimeConstants');

var SearchLabels = React.createClass ({
    render: function() {
        var selections = this.renderSelectionsLabels();
        var categories = this.renderCategoriesLabels();
        var place = this.renderPlaceLabel();
        var q = this.renderQLabel();
        var openingDays = this.renderOpeningDaysLabels();
        var priceLevel = this.renderPriceLevelLabels();
        var discount = this.renderWithDiscountLabel();
        var labels = [place].concat(q, selections, categories, openingDays, priceLevel, discount);
        return (
            <div className="label-container">
                {labels}
            </div>
        );
    },
    renderWithDiscountLabel: function() {
        var withDiscount = this.props.search.withDiscount;
        if (!withDiscount) return;
        return (
            <span key={withDiscount+'wd'} className="business-label" onClick={this.removeWithDiscount}>{'% Avec promotion'}&times;</span>
        );
    },
    removeWithDiscount: function() {
        this.props.onChange({withDiscount: undefined});
    },
    renderPriceLevelLabels: function() {
        var priceLevel = this.props.search.priceLevel;
        if (!priceLevel) return;
        return _.map(priceLevel, function(pl) {
                    return <span key={pl+'pl'} className="business-label" onClick={this.removePriceLevel.bind(this, pl)}>{'Prix : ' + _.repeat('€', (pl))}&times;</span>
                }, this);
    },
    removePriceLevel:function (pl) {
        this.props.onChange({priceLevel: _.without(this.props.search.priceLevel, pl)});
    },
    renderOpeningDaysLabels: function() {
        var days = this.props.search.days;
        if (!days) return;
        return _.map(days, function(day) {
                    return <span key={day} className="business-label" onClick={this.removeOpeningDay.bind(this, day)}>{'Ouvert le : ' + DateTimeConstants.weekDayLabelFR(day)}&times;</span>
                }, this)
    },
    removeOpeningDay: function(day) {
        this.props.onChange({days: _.without(this.props.search.days, day)});
    },
    renderQLabel: function () {
        var q = this.props.search.q;
        if (!q) return;
        return (
            <span key={q} className="business-label" onClick={this.removeQ}>{'Nom du salon : ' + q}&times;</span>
        );
    },
    removeQ: function() {
        this.props.onChange({q: undefined});
    },
    renderPlaceLabel: function() {
        // debugger;
        var address = this.props.search.address;
        if (address == 'France') return;
        return (
            <span key={address} className="business-label" onClick={this.removePlace}>{'Localisation : ' + address}&times;</span>
        );
    },
    removePlace: function() {
        this.props.onChange({address: 'France'});
    },
    renderCategoriesLabels: function() {
        if (!this.props.search.categories) return null;
        return _.map(this.props.searchedCategories, function(cat) {
                    return (
                        <span key={cat.id} className="business-label" onClick={this.removeCategory.bind(this, cat)}>{cat.label}&times;</span>
                    );
                }, this)
    },
    removeCategory: function (category) {
        this.props.onChange({categories: _.without(this.props.search.categories, category.slug)});
    },
    renderSelectionsLabels: function() {
        if (!this.props.search.selections) return null;
        return _.map(this.props.searchedSelections, function(selection){
                    return (
                        <span key={selection.id} className="business-label" onClick={this.removeSelection.bind(this, selection.slug)}>{selection.label}&times;</span>
                    );
                }, this)
    },
    removeSelection: function (selectionSlug) {
        this.props.onChange({selections: _.without(this.props.search.selections, selectionSlug)});
    }
});

module.exports = SearchLabels;
