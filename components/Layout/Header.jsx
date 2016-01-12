'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var _ = require('lodash');
var User = require('./User.jsx');
var SearchBar = require('./SearchBar.jsx');

var Header = React.createClass({
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
                            *<a className="col-xs-4 menu-trigger pull-right" role="button"></a>*
                        </nav>
                    
                </header>
                <div className="mobile-menu">
                    <div className="container">
                        <ul>
                            <li><Link route="connect_page">Me connecter</Link></li>
                            <li><Link route="registration_page">M'inscrire</Link></li>
                            <li>Recherche</li>
                            <li><a href="http://blog.hairfie.com" target="_blank">Le blog d'Hairfie</a></li>
                            <li><a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">Mentions légales</a></li>
                            <li><Link route="home_pro">Gérez votre salon</Link></li>
                        </ul>
                    </div>
                </div>
                <SearchBar mobile={true} />
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
                            <nav className='col-md-8 pull-right'>
                                <ul>
                                    <li>
                                        {proLinkNode}
                                    </li>
                                    <User />
                                </ul>
                            </nav>
                        </div>
                    </div>
                </header>
                {this.props.home ? null : <SearchBar />}
            </div>
        );
    },
    componentDidMount: function() {
        $('body').on("click",'.mobile-nav .menu-trigger',function(){
            if( parseInt($('.mobile-menu').css('marginLeft')) > 0) {
                $('body').toggleClass('locked');
                $('.menu-trigger').addClass('close');
                TweenMax.to('.mobile-menu', 0.4, {marginLeft:'0px',ease:Power2.easeInOut});
            } else {
                $('body').toggleClass('locked');
                $('.menu-trigger').removeClass('close');
                TweenMax.to('.mobile-menu', 0.4, {marginLeft: '100%',ease:Power2.easeOut});
            }
        });
    }
});

module.exports = Header;