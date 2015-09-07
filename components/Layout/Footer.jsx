'use strict';

var React = require('react');
var Link = require('../Link.jsx');

module.exports = React.createClass({
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
                    <div className="row">
                        <ul className="footer-links col-md-7">
                        <li className="col-sm-2"><a href="http://jobs.hairfie.com/">Recrutement</a></li>
                        <li className="col-sm-2"><a href="#">Presse</a></li>
                        <li className="col-sm-2"><a href="http://blog.hairfie.com/">Blog</a></li>
                        <li className="col-sm-4"><a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">Conditions Générales</a></li>
                        <li className="col-sm-2"><Link route="home_pro" className="btn btn-red">Gérez votre salon</Link></li>

                        </ul>
                    </div>
                    <div className="row">
                        <div className="hr col-sm-10 col-xs-10"></div>
                    </div>
                    <h4>Rejoignez-nous sur :</h4>
                    <div className="row">
                        <ul className="social-links col-md-3">
                            <li><a href="https://www.facebook.com/pages/Hairfie/1507026002849084" target="_blank" className='icon'>b</a></li>
                            <li><a href="https://twitter.com/HairfieApp" target="_blank" className='icon'>a</a></li>
                            <li><a href="https://plus.google.com/+Hairfie" target="_blank" className='icon'>c</a></li>
                            <li><a href="https://instagram.com/HairfieApp" target="_blank" className='icon'>x</a></li>
                            <li><a href="https://www.pinterest.com/hairfie/" target="_blank" className='icon'>d</a></li>
                        </ul>
                    </div>
                    <p>© Hairfie 2015</p>
                </div>
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
    }
});
