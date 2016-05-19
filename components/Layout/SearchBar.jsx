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
            selectedCategories: "",
            location: "",
            activeLocation: false
        };
    },
    componentWillMount: function() {
        if(this.props.findMe) {
            this.findMe();
        }
    },
    componentWillReceiveProps: function(newProps) {
        if(newProps.findMe && this.props.findMe != newProps.findMe) this.findMe();
        if (newProps.location && this.state.activeLocation) {
            this.setState({location: newProps.location}, function() {
                this.refs.address.refs.geoSuggest.update(newProps.location);
            });
        }
    },
    render: function() {
        if (this.props.mobile) return this.renderMobile();
        else if (this.props.home) return this.renderHomePage();
        else return this.renderSearchBar();
    },
    renderSearchBar: function() {
        var findMeBtnContent = null;
        if (this.state.location =='' && this.state.activeLocation) {
            findMeBtnContent = (
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
            );
        }
        if (this.props.displaySearch) {
            return (
                <div className="searchbar small-search col-xs-12 hidden-xs">
                    <div className="col-xs-3 input-group">
                        <GeoInput ref="address" placeholder="Où ?" value={this.state.location} onSuggestChange={this.handleLocationChange} />
                        <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" >{findMeBtnContent}</a>
                    </div>
                    <div className="col-xs-3" style={{paddingLeft: '0'}}>
                        {this.renderSelect()}
                    </div>
                    <input ref="query" onKeyPress={this.handleKey} type="search" placeholder="Nom du coiffeur" className="col-xs-3" />
                    <button type="button" className="btn btn-red" onClick={this.submit}>Trouvez votre coiffeur</button>
                </div>
            );
        }
        return null;
    },
    renderHomePage: function() {
        var findMeBtnContent = null;
        if (this.state.location =='' && this.state.activeLocation) {
            findMeBtnContent = (
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
            );
        }
        return (
            <div className="searchbar main-searchbar hidden-xs">
                <div className="col-xs-4 input-group">
                    <GeoInput ref="address" placeholder="Où ?" onKeyPress={this.handleKey} />
                    <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" >{findMeBtnContent}</a>
                </div>
                <div className="col-xs-2 homeSearch" style={{padding: '0'}}>
                    {this.renderSelect()}
                </div>
                <input className='col-xs-3 business-name' onKeyPress={this.handleKey} ref="query" type="search" placeholder="Nom du coiffeur" />
                <Button onClick={this.submit} className='btn btn-red col-xs-3'>Trouvez votre coiffeur</Button>
            </div>
       );
    },
    renderMobile: function() {
        var findMeBtnContent = null;
        if (this.state.location =='' && this.state.activeLocation) {
            findMeBtnContent = (
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
            );
        }
        return (
            <div {...this.props}>
                <h2>Trouvez le (bon) coiffeur !</h2>
                <div className="searchbar">
                    <div className="col-xs-12 input-group where">
                        <GeoInput ref="address" placeholder="Où ?" onKeyPress={this.handleKey} />
                        <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" >{findMeBtnContent}</a>
                    </div>
                    <div className="col-xs-12 mobile-categories" style={{textAlign: 'start'}}>
                        <select ref="mobileCategories" defaultValue="" placeholder="Spécialité" className="col-sm-3" onChange={this.handleMobileCategoriesChange}>
                            <optgroup label="Spécialités">
                                <option value="" disabled className="is-disabled">Sélectionnez une spécialité</option>
                                {_.map(this.props.categories, function(cat) {
                                    return <option value={cat.slug} key={cat.id}>{cat.label}</option>;
                                })}
                            </optgroup>
                        </select>
                    </div>
                    <div className='col-xs-12 name'>
                        <input onKeyPress={this.handleKey} ref="query" type="search" placeholder="Nom de votre coiffeur ?" />
                    </div>
                    <div className="col-xs-12 action">
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
                placeholder="Spécialité"
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
            location: e
        });
    },
    handleKey: function(e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.submit();
        }
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
            this.refs.address.refs.geoSuggest.update(this.state.location);
        }
        else {
            this.context.executeAction(PlaceActions.getPlaceByGeolocation);
        }
    },
    submit: function () {
        if (this.props.close) this.props.close();

        var search = {
            address : this.refs.address && this.refs.address.getFormattedAddress(),
            q       : this.refs.query.value ? this.refs.query.value : ""
        };
        if (this.state.selectedCategories) {
            search['categories'] = this.state.selectedCategories.split(',');
        }

        this.context.executeAction(BusinessActions.submitSearch, search);
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
