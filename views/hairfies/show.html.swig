{% extends '../layouts/main.html.swig' %}

{% block meta %}
    <title>Hairfie from {{ hairfie.author.firstName }}</title>
{% endblock %}


{% block content %}
    <div class="row hairfie">
        <div class="col-md-6 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-10 col-xs-offset-1 hairfie-picture">
            <img src="{{ hairfie.picture.url }}" />
        </div>

        <div class="col-md-4 col-sm-4 col-sm-offset-0 col-xs-10 col-xs-offset-1 hairfie-legend-container">
            <div class="legend">
                <div class="avatar">
                    <img src="{{hairfie.author.picture.url }}" class="img-circle" />
                </div>
                <div class="author">
                    <span class="name">{{ hairfie.author.firstName }} {{ hairfie.author.lastName | first | capitalize }}.</span>
                </div>

            </div>
        </div>
    </div>
{% endblock %}