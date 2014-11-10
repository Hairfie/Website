{% set current_page = 'index' %}
{% extends '../layouts/main.html.swig' %}

{% block meta %}
    <title>Home</title>
{% endblock %}


{% block content %}
    <div class="row">
        <section id="txt">
            <h1>
                Hairfie, l'App qui vous permet de trouver et de réserver la coiffure et le coiffeur qui vous correspondent !
            </h1>
            <div class="trait"></div>
            <p>
                Grâce à Hairfie, choisissez le coiffeur qui vous correspond à partir de photos de coiffures et d'avis.
                N’importe où. N’importe quand.Réservez simplement et bénéficiez de promotions ciblées !
            </p>

            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8"><img id="btn-apple" src="img/btn-apple@2x.png"> </a>

        </section>
        <img id="iphone" src="/img/iphone@2x.png">
    </div>
{% endblock %}