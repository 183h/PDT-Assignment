$( document ).ready(function() {

	function onEachFeature(feature, layer) {
	    // does this feature have a property named popupContent?
	    if (feature.properties && feature.properties.f1) {
	        layer.bindPopup(feature.properties.f1);
	    }
	}

	apiCallResult = null;

	$.ajax({
	    url: 'http://127.0.0.1:5000/api/get/hiking',
	    async: false,
	    success: function(result){
	        apiCallResult = result;
	    }
	});

	console.log(apiCallResult.data[0][0].features)

	map = L.map('mapid').setView([48.6905689, 19.4581682], 8);

	L.geoJSON(apiCallResult.data[0][0].features, {
    	onEachFeature: onEachFeature
	}).addTo(map);
	// L.geoJSON(geo1).addTo(map);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    	maxZoom: 18,
    	id: 'mapbox.streets',
    	accessToken: 'pk.eyJ1IjoibXB1ayIsImEiOiJjajgwMzViM2k2OG1jMnFudHFpZWFpcDBuIn0.tJeJccXTdskhNbv2IS5kAQ'
	}).addTo(map);

	L.easyButton('<img src="static/icons/location.png">', function (btn, map) {
    	map.locate({
        	setView: false,
        	maxZoom: 8
    	});

    	map.on('locationfound', function(e) {
    		// save coordinates
		});
	}).addTo(map);
});