'use strict';

var React = require('react');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');
var BusinessActions = require('../../actions/BusinessActions');
var Link = require('../Link.jsx');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        if(this.props.mobile) {
            return this.renderMobile();
        } else if(this.props.homepage) {
            return this.renderHomePage();
        } else {
            return this.renderLayout();
        }
    },
    renderLayout: function () {
        return (
            <div className="searchbar small-search col-sm-12">
                <GeoInput ref="address" placeholder="Où ?" className="col-sm-3" />
                <input ref="query" onKeyPress={this.handleKey} type="search" placeholder="Ex: Coupe, Brushing etc." className="col-sm-3" />
                <input ref="date" type="date" className="col-sm-3" />
                <button type="button" className="btn btn-red" onClick={this.submit}>Trouvez votre coiffeur</button>
            </div>
        );
    },
    renderHomePage: function() {
        return (
            <div className="searchbar main-searchbar hidden-xs">
                <div className="col-sm-6">
                    <GeoInput ref="address" placeholder="Où ?" className="col-xs-6" />
                    <input className='col-xs-6' onKeyPress={this.handleKey} ref="query" type="search" placeholder="Ex: Coupe, Brushing etc." />
                </div>
                <div className="col-sm-6">
                    <input ref="date" type="date" className='col-xs-6'/>
                    <Button onClick={this.submit} className='btn btn-red col-xs-6'>Trouvez votre coiffeur</Button>
                </div>
            </div>
       );
    },
    renderMobile: function() {
        return (
            <div className="mobile-nav visible-xs">
                <header className="container">
                    <Link className="logo col-xs-4" route="home" />
                    <a href="#" className="col-xs-4 menu-trigger pull-right"></a>
                </header>
                <div className="mobile-menu">
                    <div className="container">
                        <h2>Recherche</h2>
                        <span className="hr"></span>
                        <div className="searchbar col-xs-10">
                            <GeoInput ref="address" className='col-xs-12' placeholder="Où ?" />
                            <input className='col-xs-12' ref="query" type="search" placeholder='Nom, spécialité...' />
                            <input ref="date" type="date" className='col-xs-12'/>
                            <Button onClick={this.submit} className='btn btn-red col-xs-12'>Lancer la recherche</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleKey: function(e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.submit();
        }
    },
    submit: function () {
        var search = {
            address : this.refs.address && this.refs.address.getFormattedAddress(),
            q       : this.refs.query.getDOMNode().value,
            date    : this.refs.date.getDOMNode().value
        };

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
    }
});
