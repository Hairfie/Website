'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var User = require('./User.jsx');
var SearchBar = require('./SearchBar.jsx');
var Picture = require('../Partial/Picture.jsx');
var Button = require('react-bootstrap').Button;

var Header = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            displaySearch: false
        };
    },
    componentWillReceiveProps: function(props) {
        if (props.displaySearch) { 
            this.setState({displaySearch: props.displaySearch}); 
        }
    },
    render: function() {
        return (
            <div>
                {this.renderMobile()}
                {this.renderDesktop()}
            </div>
        );
    },
    renderMobile: function (withProLink) {
        return (
            <div className="mobile-nav visible-xs">
                <header className="container white visible-xs">
                    <Link className="logo col-xs-4" route="home" />
                        <nav className='col-md-8 pull-right'>
                            *<a className="col-xs-4 menu-trigger pull-right" role="button" onClick={this.handleDisplayMenu}></a>*
                        </nav>
                    
                </header>
                {this.state.displaySearch ? <SearchBar mobile={true} findMe={this.props.findMe} /> : this.renderMobileMenu()}
            </div>
        );
    },
    renderMobileMenu: function() {
        return (
            <div className="mobile-menu">
                <ul>
                    <User mobile={true} />
                    <a role="button"><li onClick={this.handleDisplaySearch} className="search-nav">Recherche</li></a>
                    <Link route="business_search" params={{address: 'France'}}><li className="salon" onClick={this.close}>Tous les coiffeurs</li></Link>
                    <Link route="hairfie_search" params={{address: 'France'}}><li className="hairfies" onClick={this.close}>Tous les hairfies</li></Link>
                    <a href="http://blog.hairfie.com" target="_blank"><li className="blog">Le blog d'Hairfie</li></a>
                    <Link route="home_pro"><li className="salon" onClick={this.close}>Gérez votre salon</li></Link>
                </ul>
                {/*<div className="download">
                    <p>Téléchargez l'application pour poster un Hairfie !</p>
                </div>*/}
            </div>
        );
    },
    renderDesktop: function () {
        var headerClassName = this.props.home ? 'home' : 'white';

        return (
            <div>
                <header className={headerClassName + ' hidden-xs'}>
                    <div className="dark-header">
                        <div className="container">
                            <div className="col-sm-5 col-md-6 col-lg-7" style={{paddingLeft: 0}}>
                                <Link route="home_pro">Vous gérez un salon ?</Link>
                            </div>
                            <div className="col-sm-7 col-md-6 col-lg-5" style={{textAlign: "end", paddingRight: 0}}>
                                <Link  route="howitworks_page">Comment ça marche ?</Link>
                                <User />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="col-sm-2 col-md-4" style={{paddingLeft: 0}}>
                            <Link route="home" className="logo" />
                        </div>
                        <ul className="col-sm-7 col-md-5">
                            <li>
                                <Link route="business_search" params={{address: 'France'}}>LES COIFFEURS</Link>
                            </li>
                            <span className="separate"> &#9830;</span>
                            <li>
                                <Link route="hairfie_search" params={{address: 'France'}}>LES HAIRFIES</Link>
                            </li>
                            <span className="separate"> &#9830;</span>
                            <li>
                                <a href="http://blog.hairfie.com" target="_blank">LE BLOG</a>
                            </li>
                        </ul>
                        <Button className="col-sm-3 btn-search" onClick={this.handleDisplaySearch}>
                            Recherchez
                        </Button>
                    </div>
                </header>
                <div className="container">
                    {this.props.home ? null : <SearchBar mobile={false} displaySearch={this.state.displaySearch} />}
                </div>
            </div>
        );
    },
    handleDisplaySearch: function() {
        this.setState({displaySearch: !this.state.displaySearch});
    },
    handleDisplayMenu: function() {
        this.setState({displaySearch: false});
    },
    close: function() {
        $('body').removeClass('locked');
        $('.menu-trigger').removeClass('close');
        TweenMax.to('.mobile-menu', 0, {height: '0', minHeight:'0', ease:Power2.easeOut});
    },
    componentDidMount: function() {
        $('.menu-trigger').on("click", function() {
            if( $('.mobile-menu').height() == 0) {
                $('body').addClass('locked');
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0, {height:'100vh',ease:Power2.easeInOut});
            } else {
                $('body').removeClass('locked');
                $('.menu-trigger').removeClass('close');
                TweenMax.to('.mobile-menu', 0, {height:'0', ease:Power2.easeOut});
            }
        });
    },
    componentWillUnmount: function() {
        $('.menu-trigger').off("click");
    },
    disconnect: function() {
        this.context.executeAction(AuthActions.disconnect, this.props.token);
    }
});

module.exports = Header;