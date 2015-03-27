/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');

var NavLink = require('flux-router-component').NavLink;
var Button = require('react-bootstrap/Button');

var PlaceAutocompleteInput = require('../Form/PlaceAutocompleteInput.jsx');



module.exports = React.createClass({
    render: function () {
        if(this.props.mobile) {
            return this.renderMobile();
        } else {
            return this.renderMain();
        }
    },
    renderMain: function() {
        return (
            <div className="searchbar main-searchbar hidden-xs">
                <div className="col-sm-6">
                    <PlaceAutocompleteInput ref="location" placeholder="Où ?" className='col-xs-6' />
                    <input className='col-xs-6' ref="query" type="search" placeholder='Nom, spécialité...' />
                </div>
                <div className="col-sm-6">
                    <input type="date" className='col-xs-6'/>
                    <Button onClick={this.submit} className='btn btn-red col-xs-6'>Trouvez votre coiffeur</Button>
                </div>
            </div>
       );
    },
    renderMobile: function() {
        return (
            <div className="mobile-nav visible-xs">
                <header className="container">
                    <NavLink context={this.props.context} className="logo col-xs-4" routeName="home" />
                    <a href="#" className="col-xs-4 menu-trigger pull-right"></a>
                </header>
                <div className="mobile-menu">
                    <div className="container">
                        <h2>Réservez votre coiffeur</h2>
                        <span className="hr"></span>
                        <div className="searchbar col-xs-10">
                            <PlaceAutocompleteInput className='col-xs-12' ref="location" placeholder="Où ?" />
                            <input className='col-xs-12' ref="query" type="search" placeholder='Nom, spécialité...' />
                            <input type="date" className='col-xs-12'/>
                            <Button onClick={this.submit} className='btn btn-red col-xs-12'>Lancer la recherche</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    submit: function (e) {
        e.preventDefault();

        this.props.context.executeAction(BusinessActions.SubmitSearch, {
            search: {
                address: this.refs.location.getFormattedAddress(),
                query: this.refs.query.getDOMNode().value
            }
        });
    }
});