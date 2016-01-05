'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');

var HowItWorksPage = React.createClass({
    render: function() {
        return (
            <PublicLayout>
                <div className="container howitworks">
                    <section className="title">
                        <div className="container">
                            <h1>Hairfie, Comment ça marche ?</h1>
                            <a onClick={this.scrollTo.bind(this, "second")} className="arrow hidden-xs">&#8964;</a>
                        </div>
                    </section>
                    <section className="second" ref="second">
                            <div className="row">
                                <div className="col-sm-5 col-sm-offset-1">
                                    <Picture picture={{url: "/img/howitworks/iphone.png"}} style={{width: 60, height: 64}}alt="Hairfie" />
                                    <h2>Inspirez-vous</h2>
                                    <p>Inspirez-vous grâce à des milliers de photos de vrais coupes et coiffures faites sur des clients qui vous ressemblent. Choisissez votre style parmi des centaines de coupes tendances, des lissages, des couleurs ou des extensions mais également des types de cheveux (raides, bouclés, fins, épais…) ou des produits particuliers utilisés par le salon.</p>
                                </div>
                                <div className="col-sm-5">
                                    <Picture picture={{url: "/img/howitworks/store.png"}} style={{width: 60, height: 64}}alt="70000 Salons" />
                                    <h2>Le coiffeur qui vous correspond</h2>
                                    <p>Choisissez le salon et le coiffeur qui vous correspondent parmi près de 70&nbsp;000 salons dans toute la France en accédant directement aux informations qui vous seront utiles comme l’adresse, les horaires ou les tarifs pratiqués. Confirmez votre sélection grâce aux avis laissés par les clients précédents. Pas encore d’avis sur votre coiffeur ou un salon où vous êtes déjà allé(e) ? Aidez la communauté et donnez votre avis !</p>
                                </div>
                                <div className="col-sm-5  col-sm-offset-1">
                                    <Picture picture={{url: "/img/howitworks/cal.png"}} style={{width: 60, height: 64}}alt="24/7" />
                                    <h2>Prendre RDV en ligne 24/7</h2>
                                    <p>Vous avez trouvé le salon de vos rêves ? Demandez un rendez-vous 24h sur 24h, 7 jours sur 7. Ensuite, l’équipe Hairfie s’occupe de tout afin de vous confirmer votre RDV dans les meilleurs délais (moins de 12h si le salon est ouvert). Notre service est 100% gratuit et vous n’avez pas à payer votre future prestation en ligne. Un empêchement ? Modifier votre RDV avec un simple mail. Hairfie, c’est simple, pratique et rapide !</p>
                                </div>
                                <div className="col-sm-5">
                                    <Picture picture={{url: "/img/howitworks/dollar.png"}} style={{width: 60, height: 64}}alt="Meilleur prix" />
                                    <h2>Le meilleur prix</h2>
                                    <p>Un salon de coiffure, c’est un peu comme un restaurant, tout le monde veut y aller au même moment. Vous avez un créneau disponible en semaine en journée ? Profitez de réductions de 20% à 50% dans une sélection de salons. Alors, Hairfie, le bon plan coiffure ?</p>
                                </div>
                            </div>
                    </section>
                </div>
            </PublicLayout>
        );
    },
    scrollTo: function(toRef) {
        var target = ReactDOM.findDOMNode(this.refs[toRef]);
        TweenMax.to(window, 0.5, {scrollTo:{y:target.offsetTop}, ease:Power2.easeOut});
    }
});

module.exports = HowItWorksPage;