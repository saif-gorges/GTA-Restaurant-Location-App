var svgWidth = 700;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append on SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "average_income"

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }


// function used for updating xAxis var upon click on axis label
function renderX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }


// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "average_income") {
      label = "Avg Income";
    }
    else if (chosenXAxis === "median_income") {
      label = "Med Income";
    }
    else if (chosenXAxis === "total_average_crime_rate") {
        label = "Crime Rate";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.neighbourhood}<br>${label}: ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
// Import Data
var url = '/api/scatterplotdata'
d3.json(url).then(function(data) {
    console.log(data)

  // xLinearScale function above json import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scal function
  var yLinearScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.number_of_restaurant)])
                .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
            .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.number_of_restaurant))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

  // Create group for three x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var avgIncomeLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "average_income") // value to grab for event listener
      .classed("active", true)
      .text("Average Income");

  var medIncomeLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "median_income") // value to grab for event listener
      .classed("inactive", true)
      .text("Median Income");

  var avgCrimeRate = labelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "total_average_crime_rate") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Crime Rate")

  // append y axis
  chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .text("Number of Restaurants");

  // updateToolTip function above json import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above json import

      // updates x scale for new data
      xLinearScale = xScale(data, chosenXAxis);

      // updates x axis with transition
      xAxis = renderX(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "average_income") {
        avgIncomeLabel.classed("active", true).classed("inactive", false);
        medIncomeLabel.classed("active", false).classed("inactive", true);
        avgCrimeRate.classed("active", false).classed("inactive", true);
      }
      else if (chosenXAxis === "median_income") {
        avgIncomeLabel.classed("active", false).classed("inactive", true);
        medIncomeLabel.classed("active", true).classed("inactive", false);
        avgCrimeRate.classed("active", false).classed("inactive", true);
      }
      else if (chosenXAxis === "total_average_crime_rate") {
        avgIncomeLabel.classed("active", false).classed("inactive", true);
        medIncomeLabel.classed("active", false).classed("inactive", true);
        avgCrimeRate.classed("active", true).classed("inactive", false);
      }
    }
  });
  }).catch(function(error) {
  console.log(error);
    
});