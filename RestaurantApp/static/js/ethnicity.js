//Ethnicity BarChart

//SVG Setting
var svgWidth = 700;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
  };
  
// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.selectAll("#ethnicity-plot")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${chartmargin.top})`);


// Load Data
var url = '/api/ethnicity'

d3.json(url).then(function(EthnicityData) {

  console.log(EthnicityData);

  // Cast the population value to to a number for each piece of data
  EthnicityData.forEach(function(d) {
    d.Object.values(eachNeighbourhood[0]) = d.Object.values(eachNeighbourhood[0])
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(EthnicityData.map(d => d.Object.keys(eachNeighbourhood[0])))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(EthnicityData, d => d.Object.values(eachNeighbourhood[0])])
    .range([chartHeight,0]);

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

  // Create one SVG rectangle per piece of Ethnicity Data
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(EthnicityData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.Object.keys(eachNeighbourhood[0])))
    .attr("y", d => yLinearScale(d.Object.values(eachNeighbourhood[0])))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.Object.values(eachNeighbourhood[0])));

}).catch(function(error) {
  console.log(error);
});

  
/////////Plotly Version ---Just in Case----///////////// 
//     //Set Values from Data

//     var data = data;
//     var id = data.neighbourhood_id;
//     var names = data.neighbourhood_name;
//     names.forEach(function(sample) {
//         var dropdownMenu = d3.select("#selDataset");
//         var newoption = dropdownMenu.append("option");
//         newoption.attr('value', sample);
//         newoption.text(sample);   
//         var selectedID = dropdownMenu.node().value;
//             });
//     var oceania = data.oceania_origins;
//     var asian = data.asian_origins;
//     var aboriginal = data.north_american_aboriginal_origins;
//     var northAmerican= data.other_north_american_origins;
//     var latin = data.latin_origins;
//     var european = data.european_origins;
//     var african = data.african_origins;
//     var caribbean = data.caribbean_origins;
    
// });

