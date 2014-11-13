{% if settings.env == 'development'%}
    <div class="clearfix"></div>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 well">
            <h3>DEBUG :</h3>
            {% if hairfie %}
                <pre>{{hairfie|json(2)}}</pre>
            {% endif %}
            {% if business %}
                <pre>{{business|json(2)}}</pre>
            {% endif %}
        </div>
    </div>
{% endif %}

<footer>
    <div class="container">
        <a class="social" href="https://www.facebook.com/pages/Hairfie/1507026002849084" target="_blank"><img src="/img/facebook@2x.png" /></a>
        <!--<a class="social" href=""><img src="/img/instagram@2x.png"></a>-->
        <a class="social" href="https://twitter.com/HairfieApp" target="_blank"><img src="/img/twitter@2x.png" /></a>
        <a class="social" href="mailto:hello@hairfie.com" target="_blank"><img src="/img/mail@2x.png" /></a>
    </div>
</footer>