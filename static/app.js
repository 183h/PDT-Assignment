$(document).ready(function() {
	
	// variables definitions
	map = L.map('mapid').setView([48.6905689, 19.4581682], 8);
	hikesLayer = L.geoJSON(null, {
    	onEachFeature: addPopup,
    	style: styleHikeDifficulty
	}).addTo(map);

	// functions definitions
	function callApi(apiUrl) {
		var apiCallResult = null;

		$.ajax({
	    	url: 'http://127.0.0.1:5000/' + apiUrl,
	    	async: false,
	    	success: function(result){
	        	apiCallResult = result;
	    	}
		});

		return apiCallResult;
	}

	function addPopup(feature, layer) {
	    if (feature.properties && feature.properties.f1) {
	        layer.bindPopup(feature.properties.f1);
	    }
	}

	function styleHikeDifficulty(feature) {
		var hikeLengthKm = feature.properties.f3
		if ((50 < hikeLengthKm) && (hikeLengthKm <= 100)) {
			return {color: "#cc0000"};
		}
		else if (100 < hikeLengthKm) {
			return {color: "#ff00ff"};
		}
	}

	// page logic
	allHikes = callApi('api/get/hikes')
	hikesLayer.addData(allHikes.data[0][0].features);

	var options = {
  		valueNames: [ 'f1', 'f3' ],
  		item: '<li class="list-group-item d-flex justify-content-between align-items-center"><p class="f1"></p><span class="f3 badge badge-primary badge-pill pull-left"></span></li>', 
  		page: 5,
  		pagination: true
	};

	var hikeList = new List('hike-list', options);
	allHikes.data[0][0].features.forEach(function(element) {
    	hikeList.add( element.properties );
	}); 


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