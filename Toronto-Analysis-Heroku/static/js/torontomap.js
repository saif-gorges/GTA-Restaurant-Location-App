// Creating map object
var myMap = L.map("map", {
    center: [43.6532, -79.3832],
    zoom: 9
  });
console.log("Welcome to Map Creation")

// Adding bounds to map object
var corner1 = L.latLng(43.70854, -79.36279),
corner2 = L.latLng(43.590095, -79.521849),
bounds = L.latLngBounds(corner1, corner2);
console.log(bounds)

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    // tileSize: 512,
  maxZoom: 11,
  minZoom: 8,
    // zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
  }).addTo(myMap);
    
  // Fixing map to bounds
  myMap.fitBounds(bounds);
  myMap.setMaxBounds(myMap.getBounds());

  // Use this link to get the geojson data.
 var link = "/static/data/neighbourhoods.geojson";
  // Grabbing our GeoJSON data..
 d3.json(link).then(function(data) {
    console.log("Inside function to grab geojson data")
  // Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
  // Style each feature (in this case a neighborhood)
  style: function(feature) {
      return {
          color: "white",
          fillColor: "blue",
          fillOpacity: 0.5,
          weight: 1.5
        }
      },

  // Called on each feature
  onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          click: function(event) {
            // myMap.fitBounds(event.target.getBounds());
            neighbourhood = event.target.feature.properties.FIELD_7
            console.log(neighbourhood + " neighbourhood have been clicked");

          // make api call to post data on ethnicity
            var eth_url = `/api/ethnicity/${neighbourhood}`
            console.log(eth_url) 
            // d3.json(eth_url,function(data) {
            //     console.log(data)   
            d3.json(eth_url).then(function(data) {
              console.log(data)     
        });
              }      
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<p>" + "Neighbourhood :"+ `${feature.properties.FIELD_7}`  + "</p>");
      }
    }).addTo(myMap);
 });
  