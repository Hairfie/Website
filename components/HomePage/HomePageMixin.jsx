'use strict';

var HomePageMixin = {
    componentDidMount: function () {
        TweenMax.to('.landing header.hidden-xs', 1, {
            opacity:1,
            ease:Power4.easeInOut
        });
        TweenMax.to('.headline', 0.7, {
            opacity:1,
            top:0,
            ease:Power4.easeInut,
            delay:0.5
        });
        TweenMax.to('.searchbar.hidden-xs', 0.7, {
            opacity:1,
            marginTop:'+=20',
            ease:Power4.easeOut,
            delay:0.65
        });

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
        $('body').on('click','.main-searchbar input', function(){
            $('.main-searchbar').toggleClass('open');
        });
    }
};

module.exports = HomePageMixin;