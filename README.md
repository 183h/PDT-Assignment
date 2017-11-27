# General course assignment

Build a map-based application, which lets the user see geo-based data on a map and filter/search through it in a meaningfull way. Specify the details and build it in your language of choice. The application should have 3 components:

1. Custom-styled background map, ideally built with [mapbox](http://mapbox.com). Hard-core mode: you can also serve the map tiles yourself using [mapnik](http://mapnik.org/) or similar tool.
2. Local server with [PostGIS](http://postgis.net/) and an API layer that exposes data in a [geojson format](http://geojson.org/).
3. The user-facing application (web, android, ios, your choice..) which calls the API and lets the user see and navigate in the map and shows the geodata. You can (and should) use existing components, such as the Mapbox SDK, or [Leaflet](http://leafletjs.com/).

## Example projects

- Showing nearby landmarks as colored circles, each type of landmark has different circle color and the more interesting the landmark is, the bigger the circle. Landmarks are sorted in a sidebar by distance to the user. It is possible to filter only certain landmark types (e.g., castles).

- Showing bicykle roads on a map. The roads are color-coded based on the road difficulty. The user can see various lists which help her choose an appropriate road, e.g. roads that cross a river, roads that are nearby lakes, roads that pass through multiple countries, etc.

## Data sources

- [Open Street Maps](https://www.openstreetmap.org/)

## My project

### **Application description**:

Aplikácia zobrazuje používateľovi turistické trasy na slovensku podľa ich obtiažnosti. Zároveň umožňuje používateľovi zobraziť zaujímavé turistické miesta vzhľadom na označenú turistickú trasu do zvolenej vzdialenosti.

- niektoré trasy v databáze sú reprezentované viacerými geometrickými objektami. Preto pri dopytovaní pomocou funkcie ```ST_Collect``` sa vykoná spojenie týchto častí do jedného celku.
- každý dopyt poskytuje dáta vo forme, ktorá nevyžaduje dodatočnú úpravu ich tvaru, formátu a umožňuje ich okamžité použitie.

### **Data source**:

Geografické dáta boli stiahnuté z [Geofabrik.de - Slovakia](http://download.geofabrik.de/europe/slovakia-latest.osm.pbf).

### **Technologies used**:

Flask, Leaflet, Postgis, JQuery, JQuery-UI, ListJS, Bootstrap, Leafet Awesome Markers, Leaflet Marker Cluster, Leaflet Minimap

### **API**:

```/api/get/hikes``` - služba vráti všetky turistické trasy nachádzajúce sa v databáze. Zároveň pre každú trasu vráti jej meno, operátora, dĺžku v metroch a súradnice stredu trasy.
Odpoveď:

```
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "MultiLineString",
      "coordinates": [[
        [18.1029768968524,48.3431430719103],
        [18.1042140566616,48.3427556840364],
        [18.1044769935453,48.3425563166573],
        [18.1046302461328,48.3425132665757],
        [18.1047820614158,48.342557092872],
        ...
      ]]
    },
    "properties": {
      "f1": "náučný chodník Zoborské hradisko",
      "f2": null,
      "f3": 2.65,
      "f4": "POINT(18.1066578255995 48.3449433099676)"
    }
  }]
}
```

<br/>


```/api/get/amenities/:hike/:distance``` - služba vráti všetky kultúrne zaujímavosti vzhľadom na zadanú turistickú trasu. Parameter ```:distance``` určuje v akej maximálnej vzdialenosti sa zaujímavosť môže nachádzať od trasy.
Odpoveď:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          18.088189818792,
          48.3164052662881
        ]
      },
      "properties": {
        "f1": "Knieža Pribina",
        "f2": "memorial"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          18.0887404860612,
          48.3163402099827
        ]
      },
      "properties": {
        "f1": "Corgoň",
        "f2": "monument"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          18.0873092901505,
          48.3174391665199
        ]
      },
      "properties": {
        "f1": "Cyril a Metod",
        "f2": "memorial"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          18.0863975899686,
          48.3181078720192
        ]
      },
      "properties": {
        "f1": "Ján Pavol II.",
        "f2": "memorial"
      }
    }
  ]
}
```

### **Functionality**:

Na nasledujúcom obrázku je zobrazený celkový vzhľad vytvorenej aplikácie.
![whole_app](https://github.com/mpuk/PDT-Assignment/blob/master/images/whole_app.png)

Trasy sú rozlíšené farebne podľa zložitosti. Modré trasy majú dĺžku pod 50 kilometrov, červené trasy sú dlhé od 50 do111 100 kilometrov a fialové trasy maju dĺžku nad 100 kilometrov.

<br/>

#### Zoznam trás

![hikes_list](https://github.com/mpuk/PDT-Assignment/blob/master/images/hikes_list.png)

Vedľa mapy sa nachádza interaktívny zoznam trás. Výhľadávanie dynamicky obnovuje hodnoty v liste podľa zvoleného hľadaného reťazca. Po kliknutí na položku v zozname sa vykoná nastavenie mapy na pozíciu kde sa daná trasa nachádza. Ak list obsahuje viac ako 5 trás tak sa na zvyšok aplikuje stránkovanie.

<br/>

#### Slider

![slider](https://github.com/mpuk/PDT-Assignment/blob/master/images/slider.png)

Používateľ má k dispozícii slider pre nastavenie maximálnej vzdialenosti v akej sa kultúrna zaujímavosť môže nachádzať od trasy. Ak má používateľ označenú trasu a použije slider, aplikácia dynamicky vykreslí zaujímavosti vzhľadom na novú hodnotu slider-a.

<br/>

#### Minimap

![minimap](https://github.com/mpuk/PDT-Assignment/blob/master/images/minimap.png)

V pravom dolnom rohu mapy sa nachádza menšia mapa. Túto mapku je možné skryť stlačením tlačidla v jej pravom dolnom rohu.
Na menšej mapke sú rovnako ako na hlavnej vykreslené všetky turistické trasy. Ofset priblíženia menšej mapky je vždy menší o hodnotu -3 oproti hlavnej mape.

<br/>

#### Control layers

![layers](https://github.com/mpuk/PDT-Assignment/blob/master/images/layers_control.png)

V pravom hornom rohu mapy sa nachádza tlačidlo, ktoré sa rozbalí keď naňho používateľ ukáže kurzorom. Na rozbalenom komponente sa nachádzajú 3 checkbox-y. Pomocou nich môže používateľ zvoliť, ktoré trasy vzhľadom na ich náročnosť mu budú zobrazené.

<br/>

#### Clusterization

![clusterization](https://github.com/mpuk/PDT-Assignment/blob/master/images/clusterization.png)

Keď používateľ klikne na trasu zobrazia sa mu kultúrne zaujímavosti v okolí. Na body, ktoré tieto zaujímavosti označujú je aplikované zhlukovanie a pri odľalovaní sa body dynamicky spájajú do zhlukov a naopak pri približovaní sa zhluky roztiahnu do bodov.

<br/>

#### Different amenities markers

![markers](https://github.com/mpuk/PDT-Assignment/blob/master/images/different_amenities_markers.png)

Rôzne ukazovatele na mape obsahujú rôzne ikony vzhľadom nato na akú kultúrnu zaujímavosť ukazujú.
