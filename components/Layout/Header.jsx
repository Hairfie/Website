'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var _ = require('lodash');
var User = require('./User.jsx');
var SearchBar = require('./SearchBar.jsx');
var Picture = require('../Partial/Picture.jsx');

var Header = React.createClass({
    getInitialState: function() {
        return {
            displaySearch: false
        };
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
                {this.state.displaySearch ? <SearchBar mobile={true} /> : this.renderMobileMenu()}
            </div>
        );
    },
    renderMobileMenu: function() {
        return (
            <div className="mobile-menu">
                <ul>
                    <Link route="connect_page"><li className="users">Me connecter</li></Link>
                    <a role="button"><li onClick={this.handleDisplaySearch} className="search-nav">Recherche</li></a>
                    <a href="http://blog.hairfie.com" target="_blank"><li className="blog">Le blog d'Hairfie</li></a>
                    <a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank"><li className="cgu">Mentions légales</li></a>
                    <Link route="home_pro"><li className="salon">Gérez votre salon</li></Link>
                </ul>
                {/*<div className="download">
                    <p>Téléchargez l'application pour poster un Hairfie !</p>
                </div>*/}
            </div>
        );
    },
    renderDesktop: function (withProLink) {
        var withProLink = _.isBoolean(this.props.withProLink) ? this.props.withProLink : true;
        var headerClassName = this.props.home ? 'home' : 'white';
        var proLinkNode;
        if(withProLink) {
            proLinkNode = (<Link className="btn btn-red" route="home_pro">Gérez votre salon</Link>);
        }

        return (
            <div>
                <header className={headerClassName + ' hidden-xs'}>
                    <div className="row">
                        <div className="col-md-12">
                            <Link className="logo col-md-4" route="home" />
                            <nav className='pull-right'>
                                <ul>
                                    <li>
                                        {proLinkNode}
                                    </li>
                                    <User />
                                </ul>
                            </nav>
                            {this.props.home ? null : <a className={"col-xs-4 menu-search pull-right hidden-sm" + (this.state.displaySearch ? ' close' : '')} role="button" onClick={this.handleDisplaySearch}></a>}
                        </div>
                    </div>
                </header>
                {this.props.home ? null : <SearchBar displaySearch={this.state.displaySearch} />}
            </div>
        );
    },
    handleDisplaySearch: function() {
        this.setState({displaySearch: !this.state.displaySearch});
    },
    handleDisplayMenu: function() {
        this.setState({displaySearch: false});
    },
    componentDidMount: function() {
        $('body').on("click",'.mobile-nav .menu-trigger',function(){
            if( $('.mobile-menu').height() == 0) {
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0.4, {height:'100%',ease:Power2.easeInOut});
            } else { 
                $('.menu-trigger').removeClass('close');
                TweenMax.to('.mobile-menu', 0.4, {height: '0',ease:Power2.easeOut});
            }
        });
    }
});

module.exports = Header;