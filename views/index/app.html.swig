{% extends '../layouts/main.html.swig' %}

{% block content %}
    <div id="app"></div>
{% endblock %}

{% block javascript %}
    {% parent %}
    <script type="text/javascript" src="/js/app.js"></script>
{% endblock %}
