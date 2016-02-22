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
            displayMobileFilters: false,
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
        console.log('render MobileFilters', this.state.search);
        var displayClass = 'new-filters ';
        if (!this.state.displayMobileFilters)
            displayClass += 'hidden';
        return (
            <div>
                <div className="mobile-screen hidden-md hidden-lg">
                    <a role="button" className="btn-red btn-mobile-fixed" onClick={this.handleDisplayMobileFilters}>Filtres</a>
                </div>
                <div className={displayClass}>
                    {this.renderHairfiesFilters()}
                    {this.renderBusinessFilters()}
                    <button onClick={this.handleChange} className="btn btn-red">Valider</button>
                    <button onClick={this.handleDisplayMobileFilters} className="btn btn-red">Fermer</button>
                </div>
            </div>
        );
    },
    handleDisplayMobileFilters: function() {
        if(this.state.displayMobileFilters == false)
            $('body').toggleClass('locked');
        else
            $('body').removeClass('locked');
        this.setState({displayMobileFilters: (!this.state.displayMobileFilters)});
    },
    renderBusinessFilters: function() {
        if (this.props.tab != 'business') return;
        return (
            <div>
                <CategorySubFilters 
                    cat={this.state.filtersCategoryToDisplay}
                    tab={this.props.tab}
                    onClose={this.handleCloseMobileSubFilters} 
                    allCategories={this.props.allCategories} 
                    initialSearch={this.state.search}/>
                <OpeningDays 
                    initialSearch={this.state.search}
                    cat={this.state.filtersCategoryToDisplay}
                    onClose={this.handleCloseMobileSubFilters} />
                <h1>Filtrer par</h1>
                <div>Où</div>
                <div>
                    <BusinessNameInput 
                        ref="businessNameInput"
                        initialSearch={this.state.search}
                        onSubmit={this.handleChange}/>
                </div>
                <a role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, 'businessCategories')}>Catégories</a>
                <div>
                    <a role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, 'OpeningDays')}>Jours d'ouverture</a>
                </div>
                <div>Prix</div>
                <div>
                    <PromoCheckbox
                        ref="promoCheckbox"
                        initialSearch={this.state.search} 
                        onChange={this.handlePromoChange}/>
                </div>
            </div>
        );
    },
    renderHairfiesFilters: function() {
        if (this.props.tab != 'hairfie') return;
        console.log('renderHairfiesFilters');
        return (
            <div>
                <TagSubFilters 
                    cat={this.state.filtersCategoryToDisplay} 
                    tab={this.props.tab}
                    onClose={this.handleCloseMobileSubFilters} 
                    allTags={this.props.allTags} 
                    initialSearch={this.state.search}/>
                <h1>Filtrer par</h1>
                {_.map(this.props.filterCategories, function (category) {
                        return <a key={category.id} role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, category)}>{category.name}</a>
                    }.bind(this))}
            </div>
        );
    },
    handleChange: function () {
        console.log('handleChange');
        if (this.refs.businessNameInput) {
            this.setState({search: _.assign({}, this.state.search, {q: this.refs.businessNameInput.getValue()})}, function() {
                this.props.onChange(this.state.search);
            });
        } else {
            this.props.onChange(this.state.search);
        }
        this.handleDisplayMobileFilters();
    },
    handlePromoChange: function() {
        this.setState({search: _.assign({}, this.state.search, {withDiscount: !this.state.search.withDiscount})});
    },
    handleDisplayMobileSubFilters: function(category) {
        this.setState({filtersCategoryToDisplay: category});
    },
    handleCloseMobileSubFilters: function(search) {
        if(search) {
            this.setState({search:search});
        }
        this.setState({filtersCategoryToDisplay: {}});
    }
});

var PromoCheckbox = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch
        }
    },
    render: function() {
        return (
            <div>
                <label className="checkbox-inline">
                    <input ref="promo" type="checkbox" align="baseline" onChange={this.handleChange} checked={this.state.search.withDiscount} />
                    <span />
                    Avec une promotion
                </label>
            </div>
        );
    },
    getValue: function () {
        return this.refs.promo.value;
    },
    handleChange: function () {
        this.props.onChange(this.state.search);
    }
});

var BusinessNameInput = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch
        }
    },
    render: function() {
        return (
            <div>
                <h2>Nom du coiffeur</h2>
                <div className="input-group">
                    <input className="form-control" ref="query" type="text" defaultValue={this.state.search.q}/>
                    <div className="input-group-addon"><a role="button" onClick={this.handleSubmit}>O</a></div>
                </div>
            </div>
        );
    },
    getValue: function () {
        return this.refs.query.value;
    },
    handleSubmit: function () {
        this.props.onSubmit(this.state.search);
    }
});

var OpeningDays = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            selectAll: false
        }
    },
    render: function() {
        if(this.props.cat != 'OpeningDays') return null;

        var displayDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return (
            <div className="new-filters subfilters">
                <button onClick={this.handleClose} className="btn btn-red">Précédent</button>
                <h2>Ouverture le</h2>
                {_.map(DateTimeConstants.weekDaysNumber, function(day) {
                    if (_.isEmpty(_.intersection([day], displayDays))) return null;
                    var active   = this.state.search && (this.state.search.days || []).indexOf(day) > -1;
                    var onChange = active ? this.removeDay.bind(this, day) : this.addDay.bind(this, day);
                    return (
                        <label key={DateTimeConstants.weekDayLabelFR(day)} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                            <span />
                            {DateTimeConstants.weekDayLabelFR(day)}
                        </label>
                        );
                    }, this)
                }
                <br/>
                <button onClick={this.handleClose} className="btn btn-red">Valider</button>
            </div>
        );
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
    },
    addDay: function (day) {
        this.setState({search: _.assign({}, this.state.search,{days: _.union(this.state.search.days || [], [day])})});
    },
    removeDay: function (day) {
        this.setState({search: _.assign({}, this.state.search,{days: _.without(this.state.search.days, day)})});
    }

});

var CategorySubFilters = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            selectAll: false
        }
    },
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    render: function () {
        //console.log("render subfilters", this.state);
        if(this.props.cat != 'businessCategories') return null;
        return (
            <div className="new-filters subfilters">
                <button onClick={this.handleClose} className="btn btn-red">Précédent</button>
                <h1>Catégories</h1>
                <br/>
                {_.map(this.props.allCategories, function (filter) {
                    return (
                        <div key={filter.id} className="filter-line">
                            <label className="checkbox-inline">
                                <input type="checkbox"
                                    ref={filter.id}
                                    value={filter.slug}
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
        return (_.indexOf(this.state.search.categories, filter.slug) > -1 ? true : false);
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
        this.setState({selectAll: false});
            console.log('handleClose', this.state.search);
    },
    handleFilterChange: function (e) {
        if (_.isArray(this.state.search.categories)) {
            var newTags = this.state.search.categories;
        }
        else {
            newTags = [];
        }
        if (e.currentTarget.checked === true){
            newTags.push(e.currentTarget.value);
            this.setState({search: _.assign({}, this.state.search, {categories: newTags})});
        }
        else {
            this.setState({search: _.assign({}, this.state.search, {categories:  _.without(newTags, e.currentTarget.value)})});
        }
        console.log('handleFilterChange', this.state.search);
    },
    selectAll: function () {
        if (!this.state.selectAll){
            var newTags = _.map(this.props.allCategories, function(cat) { return cat.slug; });
            this.setState({search: {categories: newTags}});

        } else {
            this.setState({search: {categories: {}}});
        }
        this.setState({selectAll: !this.state.selectAll});
    }
});

var TagSubFilters = React.createClass ({
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
        console.log("render subfilters", this.state);
        if(_.isEmpty(this.props.cat)) return null;
        return (
            <div className="new-filters subfilters">
                <button onClick={this.handleClose} className="btn btn-red">Précédent</button>
                <h1>{'Catégorie :' + this.props.cat.name}</h1>
                <br/>
                {_.map(_.groupBy(this.props.allTags, 'category.id')[this.props.cat.id], function (filter) {
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
        this.setState({selectAll: false});
            console.log('handleClose', this.state.search);

    },
    handleFilterChange: function (e) {
        if (_.isArray(this.state.search.tags)) {
            var newTags = this.state.search.tags;
        }
        else {
            newTags = [];
        }
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
            if (_.isArray(this.state.search.tags)) {
                var newTags = this.state.search.tags;
                newTags = newTags.concat(_.map(_.groupBy(this.props.allTags, 'category.id')[this.props.cat.id], function (filter) {
                    return filter.name }, this));
            }
            else {
                var newTags = _.map(_.groupBy(this.props.allTags, 'category.id')[this.props.cat.id], function (filter) {
                    return filter.name }, this);
            }
            

            this.setState({search: {tags: newTags}});
        } else {
            var currentTags = _.map(_.groupBy(this.props.allTags, 'category.id')[this.props.cat.id], function (filter) {
                return filter.name }, this);
            var newTags = _.filter(this.state.search.tags, function(tag) {
                return !_.include(currentTags, tag)});
            this.setState({search: {tags: newTags}});
        }
        this.setState({selectAll: !this.state.selectAll});
    }
});

module.exports = MobileFilters;
