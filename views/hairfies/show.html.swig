{% extends '../layouts/main.html.swig' %}

{% block meta %}
    <title>Hairfie from {{ hairfie.author.firstName }}</title>
{% endblock %}


{% block content %}
    <div class="row">
        <img src="{{ hairfie.picture.url }}" />

        <p>Posted on {% hairfie.createdAt |date('Y-m-d') %} by {{ hairfie.author.firstName }} {{ hairfie.author.lastName }}.</p>
    </div>
{% endblock %}