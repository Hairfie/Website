'use strict';

var React = require('react');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');
var BusinessActions = require('../../actions/BusinessActions');
var Link = require('../Link.jsx');
var Button = require('react-bootstrap').Button;
var User = require('./User.jsx');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Select = require('react-select');
var PlaceActions = require('../../actions/PlaceActions');

var SearchBar = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            displaySearchBar: false,
            selectedCategories: "",
            location: "",
            activeLocation: false
        };
    },
    render: function() {
        if (this.props.mobile) return this.renderMobile();
        else if (this.props.home) return this.renderHomePage();
        else return this.renderSearchBar();
    },
    renderSearchBar: function() {
        if (this.props.displaySearch) {
            return (
                <div className="searchbar small-search col-xs-12 hidden-sm">
                    <div className="col-xs-3" style={{paddingLeft: '0'}}>
                        {this.renderSelect()}
                    </div>
                    <div className="col-xs-3 input-group">
                        <GeoInput ref="address" placeholder="Où ?" value={this.state.location} onChange={this.handleLocationChange} />
                        <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" />
                    </div>
                    <input ref="query" onKeyPress={this.handleKey} type="search" placeholder="Nom du coiffeur" className="col-xs-3" />
                    <button type="button" className="btn btn-red" onClick={this.submit}>Trouvez votre coiffeur</button>
                </div>
            );
        }
        return null;
    },
    renderHomePage: function() {
        return (
            <div className="searchbar main-searchbar hidden-xs">
                <div className="col-xs-3 homeSearch" style={{padding: '0'}}>
                    {this.renderSelect()}
                </div>
                <div className="col-xs-3 input-group">
                    <GeoInput ref="address" placeholder="Où ?" value={this.state.location} onChange={this.handleLocationChange} />
                    <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" />
                </div>
                <input className='col-xs-3' onKeyPress={this.handleKey} ref="query" type="search" placeholder="Nom du coiffeur" />
                <Button onClick={this.submit} className='btn btn-red col-xs-3'>Trouvez votre coiffeur</Button>
            </div>
       );
    },
    renderMobile: function() {
        return (
            <div className="search-menu">
                <h2>Trouvez le (bon) coiffeur !</h2>
                <div className="searchbar">
                    <div className="col-xs-12 mobile-categories" style={{textAlign: 'start'}}>
                        <select ref="mobileCategories" defaultValue="" placeholder="Catégories" className="col-sm-3" onChange={this.handleMobileCategoriesChange}>
                            <optgroup label="Catégories">
                                <option value="" disabled>Sélectionnez une catégorie</option>
                                {_.map(this.props.categories, function(cat) {
                                    return <option value={cat.slug} key={cat.id}>{cat.label}</option>;
                                })}
                            </optgroup>
                        </select>
                    </div>
                    <div className="col-xs-12 input-group">
                        <GeoInput ref="address" placeholder="Où ?" value={this.state.location} onChange={this.handleLocationChange} />
                        <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" />
                    </div>
                    <div className='col-xs-12'>
                        <input onKeyPress={this.handleKey} ref="query" type="search" placeholder="Nom de votre coiffeur ?" />
                    </div>
                    <div className="col-xs-12">
                        <Button onClick={this.submit} className='btn btn-red col-xs-12'>Lancer la recherche</Button>
                    </div>
                </div>
            </div>
        );
    },
    renderSelect: function() {
        return  (
            <Select ref="categories"
                name="Catégories"
                value={this.state.selectedCategories}
                onChange={this.handleSelectCategoriesChange}
                placeholder="Catégories"
                allowCreate={false}
                options={_.map(this.props.categories, function(cat) {
                            return {value:cat.slug, label:cat.label};
                        })}
                multi={false}
                searchable={false}
                clearable={false}
            />
        );
    },
    handleLocationChange: function(e) {
        this.setState({
            location: e.currentTarget.value
        });
    },
    handleKey: function(e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.submit();
        }
    },
    handleDisplaySearchBar: function(e) {
        e.preventDefault();
        this.setState({displaySearchBar: !this.state.displaySearchBar});
    },
    handleSelectCategoriesChange: function (newVal) {
        this.setState({selectedCategories: newVal});
    },
    handleMobileCategoriesChange: function (e) {
        e.preventDefault();
        this.setState({selectedCategories: this.refs.mobileCategories.value});
    },
    findMe: function (e) {
        this.setState({
            activeLocation: true
        });
        if (this.props.location) {
            this.setState({
                location: this.props.location
            });
        }
        else {
            this.context.executeAction(PlaceActions.getPlaceByGeolocation);
        }
    },
    submit: function () {
        var search = {
            address : this.refs.address && this.refs.address.getFormattedAddress(),
            q       : this.refs.query.value
        };
        if (this.state.selectedCategories) {
            search['categories'] = this.state.selectedCategories.split(',');
        }

        this.context.executeAction(BusinessActions.submitSearch, search);
    },
    componentWillReceiveProps: function(newProps) {
        if (newProps.location && this.state.activeLocation) {
            this.setState({
                location: newProps.location
            });
        }
    }
});

SearchBar = connectToStores(SearchBar, [
    'CategoryStore',
    'PlaceStore'
], function (context, props) {
    return _.assign({}, {
        categories: context.getStore('CategoryStore').getAllCategories(),
        location: context.getStore('PlaceStore').getCurrentPosition()
    }, props);
});


module.exports = SearchBar;
