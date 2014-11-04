{% extends '../layouts/main.html.swig' %}

{% block meta %}
    <title>Hairfie || {{ business.name }}</title>
{% endblock %}


{% block content %}
    <div class="row">
        <h1> {{ business.name }}</h1>

        <dl>
            <dt>Address</dt>
            <dd>
                {% if business.address %}
                    {{ business.address.street }}<br />
                    {{  business.address.zipCode }} {{ business.address.city }}
                {% else %}
                    Information not available
                {% endif %}
            </dd>
            <dt>Phone</dt>
            <dd>{{ business.phoneNumber || 'Information not available' }}</dd>
            <dt>Timetable</dt>
            <dd>
                {% if business.timetable %} %>
                    {% for key, timeWindows in business.timetable %}
                        <li>
                            <strong>{{ key }}</strong>:
                            {% for tw in timeWindows %}
                                {% if loop.index0 > 0 %},{% endif %}
                                {{ tw.startTime }} - {{ tw.endTime }}
                            {% endfor %}
                        </li>
                    {% endfor %}
                {% else %}
                    Information not available
                {% endif %}
            </dd>
        </dl>
        <ul>
            {% for picture in business.pictures %}
                <img src="{{ picture.url }}" />
            {% endfor %}
        </ul>
    </div>
{% endblock %}