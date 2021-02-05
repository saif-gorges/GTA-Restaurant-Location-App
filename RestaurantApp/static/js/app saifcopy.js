// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
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
var url = '/api/restaurant/annex'
d3.json(url).then(function(response) {

  console.log(response);

// Cast the num_restaurants_ca value to a number for each piece of response
response.forEach(function(d) {
  d.num_restaurants_ca = +d.num_restaurants_ca;
});

// Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
var xBandScale = d3.scaleBand()
  .domain(response.map(d => d.category))
  .range([0, chartWidth])
  .padding(0.1);

// Create a linear scale for the vertical axis.
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(response, d => d.num_restaurants_ca)])
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
chartGroup.selectAll(".bar")
  .data(response)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xBandScale(d.category))
  .attr("y", d => yLinearScale(d.num_restaurants_ca))
  .attr("width", xBandScale.bandwidth())
  .attr("height", d => chartHeight - yLinearScale(d.num_restaurants_ca));

}).catch(function(error) {
console.log(error);

});

  