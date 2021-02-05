//Ethnicity BarChart

var svgWidth = 700;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
  };
  
// Define dimensions of the chart area
var chartWidth = svgWidth - Margin.left - Margin.right;
var chartHeight = svgHeight - Margin.top - Margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#ethnicity-plot")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);


