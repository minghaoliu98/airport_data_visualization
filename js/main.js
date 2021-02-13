'use strict';
(function() {

  window.addEventListener("load", init);
  var colors = chroma.scale('YlOrRd').colors(5);
  function init() {
    var mymap = L.map('map', {
        center: [37.31, -92.10],
        zoom: 5,
        maxZoom: 10,
        minZoom: 3,
        detectRetina: true // detect whether the sceen is high resolution or not.

    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);
    var states = null;
    states = L.geoJson.ajax("assets/us-states.geojson", {
      style: style
    }).addTo(mymap);
    L.control.scale({position: 'bottomleft'}).addTo(mymap);
    var airports = null;
    airports= L.geoJson.ajax("assets/airports.geojson",{
        onEachFeature: function (feature, layer) {
            layer.bindPopup("City: " + feature.properties.CITY + "  Total Enplanements: " + feature.properties.TOT_ENP + " Elevation: " + feature.properties.ELEV);
            layer.bindTooltip(feature.properties.AIRPT_NAME);
            return feature.properties.LOCCOUNTY;
        },
        pointToLayer: function (feature, latlng) {
            if (feature.properties.CNTL_TWR == "N") {
                return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-wifi color-red'})});
            } else {
                return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-wifi color-green'})});
            }
        },
      attribution: 'airports Data &copy; DATA.GOV |us-states &copy; Mike Bostock | Base Map &copy; CartoDB | Made By Minghao Liu'
    });
    airports.addTo(mymap);

    var legend = L.control({position: 'topright'});
    legend.onAdd = function () {
        // Create Div Element and Populate it with HTML
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<b>#Number of Airport in State</b><br />';
        div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 40+ </p>';
        div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 30-40 </p>';
        div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 20-30 </p>';
        div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 10-20 </p>';
        div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-10 </p>';
        div.innerHTML += '<hr><b>Control tower<b><br />';
        div.innerHTML += '<i class="fa fa-wifi color-red"></i><p> No Control Tower </p>';
        div.innerHTML += '<i class="fa fa-wifi color-green"></i><p> Has Control Tower </p>';
        // Return the Legend div containing the HTML content
      return div;
    };
    legend.addTo(mymap)

  }

  function setColor(density) {
      var id = 0;
      if (density > 40) { id = 4; }
      else if (density > 30) { id = 3; }
      else if (density > 20) { id = 2; }
      else if (density > 10) { id = 1; }
      else  { id = 0; }
      return colors[id];
  }

  function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
  }
})();
