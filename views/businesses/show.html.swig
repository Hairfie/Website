{% extends '../layouts/main.html.swig' %}

{% block meta %}
    <title>Hairfie || {{ business.name }}</title>
{% endblock %}


{% block content %}
    <div class="row" id="business-header">
        <div class="col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-12 pictures">
            {% for picture in business.pictures %}
                <!-- Todo : deal with pictures instead of only one -->
                {% if loop.first %}<img src="{{ picture.url }}?height=300&width=230" class="img-rounded"/>{% endif %}
            {% endfor %}
        </div>
        <div class="col-md-4 col-sm-3 col-xs-12 infos">
            <h1> {{ business.name }}</h1>
            <p class="info address">
                <span class="icon icon-address"></span>
                <span class="content">
                    {% if business.address %}
                        {{ business.address.street }}<br />
                        {{  business.address.zipCode }} {{ business.address.city }}
                    {% else %}
                        Information not available
                    {% endif %}
                </span>
            </p>
            <p class="info phone">
                <span class="icon icon-phone"></span>
                <span class="content">
                    <span class="label label-red">{{ business.phoneNumber || 'Information not available' }}</span>
                </span>
            </p>
        </div>
        <div class="col-md-3 col-sm-3 col-xs-12 map">
            <div id="gmap-business" data-lat={{business.gps.lat}} data-lng={{business.gps.lng}} data-title="{{business.name}}"></div>
        </div>
    </div>

    <div class="row" id="business-content">
        <div class="col-md-7 col-md-offset-1 col-xs-12 reviews-price">
            <div class="review">
                <h3>Reviews</h3>
                <div class="review">
                    No information available
                </div>
            </div>
            <div class="prices">
                <h3>Prices</h3>
                <div class="price">
                    No information available
                </div>
            </div>
        </div>
        <div class="col-md-3 col-sm-3 col-xs-12 timetable">
            <div class="header">
                <span class="icon-timetable"></span><h4>Timetable</h4>
            </div>
                {% if business.timetable %}
                    {% for key, timeWindows in business.timetable %}
                        <div class="day">
                            <span class="name">{{ key }}.</span>
                            <span class="value">
                                {% if !timeWindows.length %}
                                    Closed
                                {% else %}
                                    {% for tw in timeWindows %}
                                        <p class="time">{{ tw.startTime }} - {{ tw.endTime }}</p>
                                    {% endfor %}
                                {% endif %}
                            </span>
                        </div>
                        <div class="clearfix"></div>
                    {% endfor %}
                {% else %}
                    Information not available
                {% endif %}
            </ul>
        </div>
    </div>
{% endblock %}