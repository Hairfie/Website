{% extends '../layouts/main.html.swig' %}

{% block meta %}
    <title>Hairfie || {{ business.name }}</title>
{% endblock %}


{% block content %}
    <div class="row" id="#business-header">
        <div class="col-md-3 col-md-offset-1 pictures">
            {% for picture in business.pictures %}
                <!-- Todo : deal with pictures instead of only one -->
                {% if loop.first %}<img src="{{ picture.url }}?height=300&width=300" class="img-rounded"/>{% endif %}
            {% endfor %}
        </div>
        <div class="col-md-4">
            <h1> {{ business.name }}</h1>
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
        </div>
        <div class="col-md-3">Col 3</div>
    </div>

    <div class="row">
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
    </div>
{% endblock %}