'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        var posts = this.props.posts;

        return (
            <section className="home-section blog-posts" id="blog-posts" ref="blog-posts">
                <h2>Les actus et tendances coiffures</h2>
                <p className="subtitle">Pour rester branché(e) cheveux, capillairement connecté(e), furieusement coiffé(e)... Rien de tel qu’une petite dose d’actu chevelue !</p>
                <div className="section-content-1">
                    <div className="row">
                        {_.map(posts, this.renderPost)}
                    </div>
                    <div className="text-center">
                        <a href="http://blog.hairfie.com" target="_blank" className="btn btn-whitered">
                            Voir toutes les news
                        </a>
                    </div>
                </div>

            </section>
        );
    },
    renderPost: function (post) {
        var content = post.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '');
        var url = post.secure_featured_image_thumbnail_url ? post.secure_featured_image_thumbnail_url : post.featured_image_thumbnail_url;
        return (
            <div className="col-sm-4 col-xs-12 post" key={post.id} >
                <div className='picture-container'>
                    <a href={post.link} target="_blank">
                        <Picture picture={{url: url}} style={{width: '100%'}} placeholder="/img/placeholder-640.png" alt={post.title.rendered}/>
                    </a>
                </div>
                <div className='picture-caption'>
                    <a href={post.link} target="_blank">
                        <h4 dangerouslySetInnerHTML={{__html:post.title.rendered}} />
                    </a>
                    <a href={post.link} target="_blank" className="address">
                        <p>
                            <span dangerouslySetInnerHTML={{__html:_.trunc(content, {
                                'length' : 150,
                                'separator' : ' ',
                                'omission' : ' [...]'
                            })}} />
                        </p>
                        <a href={post.link} target="_blank" className="readmore">Lire la suite</a>
                    </a>
                </div>
            </div>
        );
    }
});
