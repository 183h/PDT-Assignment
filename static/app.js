$(document).ready(function() {
	// amenities markers
	var markerMemorial = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'university', markerColor: 'red'});
	var markerYes = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'map-pin', markerColor: 'red'});
	var markerBoundaryStone = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'bandcamp', markerColor: 'red'});
	var markerWaysideShrine = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'child', markerColor: 'red' });
	var markerMonument = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'trophy', markerColor: 'red'});
	var markerWaysideCross = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'arrows', markerColor: 'red'});
	var markerCastle = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'shield',	markerColor: 'red'});
	var markerRuins = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'bookmark', markerColor: 'red'});
	var markerArcheologicalSite = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'paint-brush', markerColor: 'red'});
	var markerBattlefield = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'crosshairs', markerColor: 'red'});
	var markerBuilding = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'building',	markerColor: 'red'});
	var markerMine = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'industry',	markerColor: 'red'});
	var markerManor = L.AwesomeMarkers.icon({prefix: 'fa',icon: 'diamond', markerColor: 'red'});
	var markerTank = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'car', markerColor: 'red'});
	var markerCannon = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'rocket',	markerColor: 'red'});
	var markerBunker = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'crosshairs', markerColor: 'red'});
	var markerLocomotive = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'train', markerColor: 'red'});
	var markerTomb = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'arrows', markerColor: 'red'});
	var markerGrave = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'arrows', markerColor: 'red'});
	var markerChurch = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'child', markerColor: 'red'});
	var markerBridge = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'arrows-hd', markerColor: 'red'});
	var markerCityGate = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'film', markerColor: 'red'});
	var markerPillory = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'bars', markerColor: 'red'});
	var markerPlaceOfWorship = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'child',markerColor: 'red'});
	var markerChateau = L.AwesomeMarkers.icon({prefix: 'fa', icon: 'diamond', markerColor: 'red'});
	var markerChalet = L.AwesomeMarkers.icon({prefix: 'fa',	icon: 'home', markerColor: 'red'});
	var markerBakery = L.AwesomeMarkers.icon({prefix: 'fa',	icon: 'birthday-cake', markerColor: 'red'});
	var markerBorderControl = L.AwesomeMarkers.icon({ prefix: 'fa',	icon: 'map', markerColor: 'red'});

	markers = {
		'memorial' : markerMemorial,
		"yes" : markerYes,
		"boundary_stone" : markerBoundaryStone,
		"wayside_shrine" : markerWaysideShrine,
		"monument" : markerMonument,
		"wayside_cross" : markerWaysideCross,
		"castle" : markerCastle,
		"ruins" : markerRuins,
		"archaeological_site" : markerArcheologicalSite,
		"battlefield" : markerBattlefield,
		"building" : markerBuilding,
		"mine" : markerMine,
		"manor" : markerManor,
		"tank" : markerTank,
		"cannon" : markerCannon,
		"bunker" : markerBunker,
		"locomotive" : markerLocomotive,
		"tomb" : markerTomb,
		"grave" : markerGrave,
		"church" : markerChurch,
		"bridge" : markerBridge,
		"city_gate" : markerCityGate,
		"pillory" : markerPillory,
		"place_of_worship" : markerPlaceOfWorship,
		"chateau" : markerChateau,
		"chalet" : markerChalet,
		"bakery" : markerBakery,
		"border_control" : markerBorderControl
	}

	// variables definitions
	var selected
	map = L.map('mapid').setView([48.6905689, 19.4581682], 8);
	amenitiesLayer = L.geoJSON(null).addTo(map);

	hikesLayer = L.geoJSON(null, {
    	onEachFeature: addPopup,
    	style: styleHikeDifficulty
	}).on('click', function (e) {
	  	// Check for selected
	  	if (selected) {	    
	    	// Reset selected to default style
	    	e.target.resetStyle(selected)
	  	}
	  
	  	// Assign new selected
	  	clusters = L.markerClusterGroup();

	  	amenitiesLayer.clearLayers()
	  	amenitiesLayer = L.geoJSON(null, {
	  		onEachFeature: addPopup,
    		pointToLayer: function(feature, latlng) {
        		return L.marker(latlng, {icon: markers[feature.properties.f2]});
        	}
      	});
	  	
	  	selected = e.layer
	  	amenities = callApi('api/get/amenities/'+e.layer.feature.properties.f1)
	  	if (amenities.data[0][0].features)
   	  		amenitiesLayer.addData(amenities.data[0][0].features);
	    
	    clusters.addLayer(amenitiesLayer).addTo(map);
	  	// Bring selected to front
	  	selected.bringToFront()
	  	// Style selected
	  	selected.setStyle({
	  		'weight': 7,
	    	'color': 'green'
	  	})
	}).addTo(map);

	var options = {
  		valueNames: [ 'f1', 'f3', 'f4' ],
  		item: 'hacker-item', 
  		page: 5,
  		pagination: true
	};
	var hikeList = new List('hike-list', options);

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
			return {color: '#cc0000'};
		}
		else if (100 < hikeLengthKm) {
			return {color: '#ff00ff'};
		}
	}

	// page logic
	allHikes = callApi('api/get/hikes')
	hikesLayer.addData(allHikes.data[0][0].features);
	
	allHikes.data[0][0].features.forEach(function(element) {
    	hikeList.add(element.properties);
	});

	$('#hikeList').on('mouseenter', function() {
  		$('#hikeList a').on('click', function() {
  			var geometry = $(this).find('input').text();
  			var latLong = geometry.replace('POINT', '').replace('(', '').replace(')', '').split(' ');
  			map.setView({lat: parseFloat(latLong[1]), lng: parseFloat(latLong[0])}, 13);
		});
	});

	var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
	var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var token = 'pk.eyJ1IjoibXB1ayIsImEiOiJjajgwMzViM2k2OG1jMnFudHFpZWFpcDBuIn0.tJeJccXTdskhNbv2IS5kAQ';

	L.tileLayer(url, {
    	attribution: attribution,
    	maxZoom: 18,
    	id: 'mapbox.streets',
    	accessToken: token
	}).addTo(map);

	var miniMapLayer = L.tileLayer(url, {
    	attribution: attribution,
    	maxZoom: 18,
    	id: 'mapbox.streets',
    	accessToken: token
	});
	var hikesMiniMap = L.geoJson(allHikes.data[0][0].features, {
		style: styleHikeDifficulty
	});
	var miniMapLayerGroup = new L.LayerGroup([miniMapLayer, hikesMiniMap]);
	var miniMap = new L.Control.MiniMap(miniMapLayerGroup, {
		width: 350,
		height: 350,
		toggleDisplay: true,
		zoomLevelOffset: -3
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