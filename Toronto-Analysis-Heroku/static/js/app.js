function buildEthinicityPlot(neighbourhood) {
  /* data route */
  var eth_url = `/api/ethnicity/${neighbourhood}` 
  d3.json(eth_url).then(function(data) {
      console.log(eth_url)
      console.log(data);
      //Plotting using Plotly

      // Cast the population value to to a number for each piece of data
      var ethnicityName = Object.keys(data[0]);
      // console.log(data);
      // console.log(Object.keys(data[0]));
      var population = Object.values(data[0]);

      var trace = {x : ethnicityName,
                  y: population,
                  type: 'bar',
                  marker: {
                    color: '#7268A6',
                    opacity: 0.7
                    // line: {width:1.0}
                    }
                  };

      var layout = {
        title: {
          text: `Ethnicity in ${neighbourhood}`,
          font: {
            family: 'Muli, Sans-Serif',
            size: 20
          }
        },
        font: {size: 10},
        height: 600,
        width: 500,
        yaxis: {
          title : {
            text: "Population",
            font: {
              family: 'Muli, Sans-Serif',
              size: 15
            }
          }
        },
        xaxis: {
          title : {
            text: "Ethnicity",
            font: {
              family: 'Muli, Sans-Serif',
              size: 15
            }
          },
          automargin: true
        },
        //automargin: true
        fixedrange: true
      }

      var data = [trace];

      Plotly.newPlot('ethnicity-plot', data, layout, {displayModeBar: true});
  });
}

// Category Plot Function
function buildCategoryPlot(neighbourhood) {

    // Empty html for the previous plot
    var category = d3.select("#restaurant-plot");
    category.html("");

    // Define SVG area dimensions
    var svgWidth = 660;
    var svgHeight = 560;

    // Define the chart's margins as an object
    var chartMargin = {
      top: 30,
      right: 30,
      bottom: 60,
      left: 50
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area to it, and set the dimensions
    var svg = d3.select("#restaurant-plot")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    // Load data from num_restaurants_ca-of-tv-watched.csv
    var url = `/api/category/${neighbourhood}`
    d3.json(url).then(function(response) {

        console.log(response);

      // Cast the num_restaurants_ca value to a number for each piece of response
        response.forEach(function(d) {
          d.num_restaurants = +d.num_restaurants;
        });

        // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
        var xBandScale = d3.scaleBand()
          .domain(response.map(d => d.category))
          .range([0, chartWidth])
          .padding(0.1);

        // Create a linear scale for the vertical axis.
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(response, d => d.num_restaurants)])
          .range([chartHeight, 0]);

        // Create two new functions passing our scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        // Append two SVG group elements to the chartGroup area,
        // and create the bottom and left axes inside of them
        chartGroup.append("g")
          .call(leftAxis);

        chartGroup.append("g")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(bottomAxis);

        // Create one SVG rectangle per piece of response
        // Use the linear and band scales to position each rectangle within the chart
        var barsGroup = chartGroup.selectAll(".bar")
                          .data(response)
                          .enter()
                          .append("rect")
                          .attr("class", "bar")
                          .attr("x", d => xBandScale(d.category))
                          .attr("y", d => yLinearScale(d.num_restaurants))
                          .attr("width", xBandScale.bandwidth())
                          .attr("height", d => chartHeight - yLinearScale(d.num_restaurants))

        // append chart title
        chartGroup.append("text")
            .attr("x", chartWidth / 2)
            .attr("y", -15)
            .style("text-anchor", "middle")
            .classed("chartTitle", true)
            .text(`Top 10 Categories in ${neighbourhood}`)

        // append y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - chartMargin.left)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .classed("active", true)
            .text("Number of Restaurants");

        // append x axis
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 15})`)
            .attr("class", "active")
            .text("Category");

        var barToolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([0, 0])
          .html(function(d) {
            return (`Category: ${d.category}<br>Number of Restaruants: ${d.num_restaurants}`)
          });
        barsGroup.call(barToolTip);

        barsGroup.on("mouseover", function(data) {
          barToolTip.show(data, this);
        
        barsGroup.on("mouseout", function(data) {
          barToolTip.hide(data, this);
        })
      });
    }).catch(error => console.log(error));  
}
  
// Category Plot Function
function buildPriceRangePlot(neighbourhood) { 

    // Empty html for the previous plot
    var pricerange = d3.select("#pricerange-plot");
    pricerange.html("");
    // Define SVG area dimensions
    var svgWidth = 460;
    var svgHeight = 560;

    // Define the chart's margins as an object
    var chartMargin = {
      top: 30,
      right: 30,
      bottom: 60,
      left: 50
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area to it, and set the dimensions
    var svg = d3.select("#pricerange-plot")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    // Load data from num_restaurants_ca-of-tv-watched.csv
    var url = `/api/pricerange/${neighbourhood}`
    d3.json(url).then(function(response) {

      console.log(response);

    // Cast the num_restaurants_ca value to a number for each piece of response
      response.forEach(function(d) {
        d.num_restaurants = +d.num_restaurants;
      });

      // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
      var xBandScale = d3.scaleBand()
        .domain(response.map(d => d.price_range))
        .range([0, chartWidth])
        .padding(0.1);

      // Create a linear scale for the vertical axis.
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(response, d => d.num_restaurants)])
        .range([chartHeight, 0]);

      // Create two new functions passing our scales in as arguments
      // These will be used to create the chart's axes
      var bottomAxis = d3.axisBottom(xBandScale);
      var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

      // Append two SVG group elements to the chartGroup area,
      // and create the bottom and left axes inside of them
      chartGroup.append("g")
        .call(leftAxis);

      chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

      // Create one SVG rectangle per piece of response
      // Use the linear and band scales to position each rectangle within the chart
      var barsGroup = chartGroup.selectAll(".bar")
                        .data(response)
                        .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("x", d => xBandScale(d.price_range))
                        .attr("y", d => yLinearScale(d.num_restaurants))
                        .attr("width", xBandScale.bandwidth())
                        .attr("height", d => chartHeight - yLinearScale(d.num_restaurants))
      // append chart title
      chartGroup.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", -15)
      .style("text-anchor", "middle")
      .classed("chartTitle", true)
      .text(`Price Range in ${neighbourhood}`)

      // append y axis
      chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - chartMargin.left)
          .attr("x", 0 - (chartHeight / 2))
          .attr("dy", "1em")
          .classed("active", true)
          .text("Number of Restaurants");

      // append x axis
      chartGroup.append("text")
          .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 15})`)
          .attr("class", "active")
          .text("Price Range");

      var barToolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(d) {
          return (`Price Range: ${d.price_range}<br>Number of Restaruants: ${d.num_restaurants}`)
        });
      barsGroup.call(barToolTip);

      barsGroup.on("mouseover", function(data) {
        barToolTip.show(data, this);
      
      barsGroup.on("mouseout", function(data) {
        barToolTip.hide(data, this);
      })
    });


}).catch(function(error) {
console.log(error);
});  

}

function displayInfo(neighbourhood) {
  url = '/api/scatterplotdata'
  d3.json(url).then(function(infoData) {
    var selected = infoData.filter(d => d.neighbourhood == neighbourhood)[0];
    console.log(selected);

    var panelBody = d3.select("#selected-info");

    // To get the new panel with selected id data, clear the panel
    panelBody.html("")

    panelBody.append("h5").text(`${neighbourhood}`).append("hr")
    // Use `Object.entries` and d3 to append <p> and update value per each key and value
    Object.entries(selected).forEach( ([key, value]) => {
      var row = panelBody.append("p");
      row.text(`${key}: ${value}`);
    });

  });
};


// initial graphs
var initialNeighbourhood = 'South Riverdale'
buildEthinicityPlot(initialNeighbourhood)
buildCategoryPlot(initialNeighbourhood)
buildPriceRangePlot(initialNeighbourhood)
displayInfo(initialNeighbourhood)


// Creating map object
var myMap = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 8
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
        fillColor: "#6B3074",
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


          //////////// Update Ethnicity Bar Graph ////////////
          buildEthinicityPlot(neighbourhood);
          //////////// Update Restaurant Category Bar Graph ////////////
          buildCategoryPlot(neighbourhood);
          //////////// Update Restaurant Price Range Bar Graph ////////////
          buildPriceRangePlot(neighbourhood);
          //////////// Update Display Panel ////////////
          displayInfo(neighbourhood);

        }      

  });

       // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<p>" + "Neighbourhood :"+ `${feature.properties.FIELD_7}`  + "</p>");
      //"</h1> <hr> <h2>" + feature.properties.FIELD_12 + feature.properties.FIELD_11

    }
  }).addTo(myMap)
});


