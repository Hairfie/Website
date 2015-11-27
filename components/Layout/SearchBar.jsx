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

var mobileHeader = React.createClass({
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
    render: function () {
        if(this.props.mobile) {
            return this.renderMobile();
        } else if(this.props.homepage) {
            return this.renderHomePage();
        } else {
            return this.renderLayout();
        }
        return <div></div>;
    },
    renderLayout: function () {
        return (
            <div>
                <header className='white hidden-xs'>
                    <div className="row">
                        <div className="col-md-12">
                            <Link className="logo col-md-4" route="home" />
                            <nav className='pull-right'>
                                <ul>
                                    <li>
                                        <Link className="btn btn-red" route="home_pro">Gérez votre salon</Link>
                                    </li>
                                    <User />
                                </ul>
                            </nav>
                            *<a className={"col-xs-4 menu-trigger pull-right hidden-sm" + (this.state.displaySearchBar ? ' close' : '')} role="button" onClick={this.handleDisplaySearchBar}></a>*
                        </div>
                    </div>
                </header>
                {this.renderSearchBar()}
            </div>
        );
    },
    renderSearchBar: function() {
        if (this.state.displaySearchBar) {
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
                <input className='col-xs-3' onKeyPress={this.handleKey} ref="query" type="search" placeholder="Nom du coiffeur (facultatif)" />
                <Button onClick={this.submit} className='btn btn-red col-xs-3'>Trouvez votre coiffeur</Button>
            </div>
       );
    },
    renderMobile: function() {
        return (
            <div className="mobile-nav visible-xs">
                <header className="container white">
                    <Link className="logo col-xs-4" route="home" />
                    <nav className='col-md-8 pull-right'>
                        <ul>
                           <User mobile={true}>
                                <li>
                                    <Link route="home_pro">Gérez votre salon</Link>
                                </li>
                           </User>
                        </ul>
                    </nav>
                    *<a className="col-xs-4 menu-trigger pull-right" role="button"></a>*
                </header>
                <div className="mobile-menu">
                    <div className="container">
                        <h2>Recherche</h2>
                        <span className="hr"></span>
                        <div className="searchbar col-xs-10">
                            <div className="col-xs-12 mobile-categories" style={{marginBottom: '20px', textAlign: 'start'}}>
                                <select ref="mobileCategories" placeholder="Catégories" className="col-sm-3" onChange={this.handleMobileCategoriesChange}>
                                    <optgroup label="Catégories">
                                        <option value="" disabled selected>Sélectionnez une catégorie</option>
                                        {_.map(this.props.categories, function(cat) {
                                            return <option value={cat.slug}>{cat.label}</option>;
                                        })}
                                    </optgroup>
                                </select>
                            </div>
                            <div className="col-xs-12 input-group">
                                <GeoInput ref="address" placeholder="Où ?" value={this.state.location} onChange={this.handleLocationChange} />
                                <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" />
                            </div>
                            <input className='col-xs-12' onKeyPress={this.handleKey} ref="query" type="search" placeholder="Nom du coiffeur" />
                            <Button onClick={this.submit} className='btn btn-red col-xs-12'>Lancer la recherche</Button>
                        </div>
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
    componentDidMount: function() {
        $('body').on("click",'.mobile-nav .menu-trigger',function(){
            if( $('.mobile-menu').height() == 0 ) {
                $('body').toggleClass('locked');
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0.4, {height:'100vh',ease:Power2.easeInOut});
            } else {
                $('body').toggleClass('locked');
                $('.menu-trigger').removeClass('close');
                TweenMax.to('.mobile-menu', 0.4, {height:0,ease:Power2.easeOut});
            }
        });
    },
    componentWillUnmount: function() {
        $('body').removeClass('locked');
    },
    componentWillReceiveProps: function(newProps) {
        if (newProps.location && this.state.activeLocation) {
            this.setState({
                location: newProps.location
            });
        }
    }
});

mobileHeader = connectToStores(mobileHeader, [
    'CategoryStore',
    'PlaceStore'
], function (context, props) {
    return _.assign({}, {
        categories: context.getStore('CategoryStore').getAllCategories(),
        location: context.getStore('PlaceStore').getCurrentPosition()
    }, props);
});


module.exports = mobileHeader;
