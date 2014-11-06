<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    {% block meta %}{% endblock %}

    <!-- CSS -->
    <link rel="stylesheet" href="../../css/style.css">
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css'>
    <!-- bower:css -->
    <!-- endbower -->
    <!-- endCSS -->
</head>
<body>
    {% include '../partials/header.html.swig' %}

    <div class="container-fluid">
        {% block content %}{% endblock %}
    </div>

    {% include '../partials/footer.html.swig' %}

    <!-- bower:js -->
    <script src="../../components/jquery/dist/jquery.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/button.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js"></script>
    <script src="../../components/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js"></script>
    <!-- endbower -->

    <script src="../../js/maps.js"></script>
</body>
</html>