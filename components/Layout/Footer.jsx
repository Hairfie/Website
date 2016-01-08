'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var EmailModal = require('../Partial/EmailModal.jsx');
var LinksSection = require('./LinksSection.jsx');
var Picture = require('../Partial/Picture.jsx');

var connectToStores = require('fluxible-addons-react/connectToStores');
var _ = require('lodash');

var Footer = React.createClass({
    render: function() {
        if(this.props.mobile) {
            return this.renderMobile();
        } else {
            return this.renderDesktop();
        }
    }, 
    renderDesktop: function () {
        return (
            <footer className="visible-md visible-lg">
                <div className="container">
                    <Picture picture={{url: '/img/loader/' + name + '.png'}} style={{width: 25, height: 25, marginRight: 7}} />
                    <h4>Rejoignez-nous !</h4>
                    <div className="row">
                        <ul className="social-links col-md-3">
                            <li><a href="https://www.facebook.com/Hairfie" target="_blank" className='icon'>b</a></li>
                            <li><a href="https://twitter.com/Hairfie" target="_blank" className='icon'>a</a></li>
                            <li><a href="https://plus.google.com/+Hairfie" target="_blank" className='icon'>c</a></li>
                            <li><a href="https://instagram.com/Hairfie" target="_blank" className='icon'>x</a></li>
                            <li><a href="https://www.pinterest.com/hairfie/" target="_blank" className='icon'>d</a></li>
                        </ul>
                    </div>
                    <div className="row">
                        <ul className="footer-links col-md-9">
                            <li className="col-sm-2" target="_blank"><a href="http://jobs.hairfie.com/">Recrutement</a></li>
                            <li className="col-sm-2">
                                <Link route="howitworks_page">Comment ça marche ?</Link>
                            </li>
                            <li className="col-sm-2"><a onClick={this.openEmailModal}>Newsletter</a></li>
                            <li className="col-sm-2"><a href="http://blog.hairfie.com/" target="_blank"a>Blog</a></li>
                            <li className="col-sm-2"><a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">Conditions générales</a></li>
                            <li className="col-sm-2"><Link route="home_pro">Gérez votre salon</Link></li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="hr col-sm-10 col-xs-10"></div>
                    </div>
                    <p>Hairfie, c'est la plateforme Web et mobile qui permet aux coiffeurs de diffuser leur talent
                        mais aussi aux clients de trouver et prendre rendez-vous avec le coiffeur qui correspond !</p>
                    <p>© Hairfie 2015</p>
                    <LinksSection links={this.props.links}/>
                </div>
                <EmailModal ref="emailModal" />
            </footer>
        );
    },
    renderMobile: function() {
        return (
            <footer className="visible-xs visible-sm mobile">
                <div className="row">
                    <div className="col-xs-6 pull-left">
                        <Link route="home_pro" className="btn btn-red">Déclarez votre salon</Link>
                    </div>
                    <div className="col-xs-6 pull-right">
                        <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="app-dl" target="_blank"></a>
                    </div>
                </div>
            </footer>
        )
    },
    openEmailModal: function() {
        this.refs.emailModal.open();
    }
});

Footer = connectToStores(Footer, [
    'FooterLinkStore'
], function (context, props) {
    return _.assign({}, {
        links       : context.getStore('FooterLinkStore').all()
    }, props);
});

module.exports = Footer;
