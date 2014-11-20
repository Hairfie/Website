{% extends '../layouts/main.html.swig' %}

{% block content %}
    <div id="app">
        {{ appHtml|safe }}
    </div>
{% endblock %}

{% block javascript %}
    {% parent %}
    <script type="text/javascript">
    window.appState = {{ appState|safe|json }};
    </script>
    <script type="text/javascript" src="/js/app.js"></script>
{% endblock %}
