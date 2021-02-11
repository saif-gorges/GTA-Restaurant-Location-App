var svgWidthScatter = 900;
var svgHeightScatter = 660;

var marginScatter = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
  };
  
var widthScatter = svgWidthScatter - marginScatter.left - marginScatter.right;
var heightScatter = svgHeightScatter - marginScatter.top - marginScatter.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svgScatter = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidthScatter)
  .attr("height", svgHeightScatter);

// Append on SVG group
var chartGroupScatter = svgScatter.append("g")
  .attr("transform", `translate(${marginScatter.left}, ${marginScatter.top})`);

// Initial Params
var chosenXAxis = "average_income"

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, widthScatter]);
  
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
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.neighbourhood}<br>${label}: ${d[chosenXAxis]}<br>restaurants: ${d.number_of_restaurants}`);
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


var url = '/api/scatterplotdata'
d3.json(url).then(function(scatterData) { 
    
    // data.forEach(function (data) {
    //   data.average_income = +data.average_income
    // });

      // parse data
    scatterData.forEach(function(data) {
        data.average_income = +data.average_income;
        data.median_income = +data.median_income;
        data.number_of_restaurants = +data.number_of_restaurants;
        data.total_average_crime_rate = +data.total_average_crime_rate;
    });

    console.log(d3.min(scatterData, d => d[chosenXAxis]))
    console.log(d3.max(scatterData, d => d[chosenXAxis]))
    console.log(d3.max(scatterData, d => d.number_of_restaurants))

    // xLinearScale function above json import
    var xLinearScaleSc = xScale(scatterData, chosenXAxis);

    // Create y scale function
    var yLinearScaleSc = d3.scaleLinear()
        .domain([0, d3.max(scatterData, d => d.number_of_restaurants)])
        .range([heightScatter, 0]);



    // Create initial axis functions
    var bottomAxisSc = d3.axisBottom(xLinearScaleSc);
    var leftAxisSc = d3.axisLeft(yLinearScaleSc);

    // // append y axis grid
    // var yAxisGrid = d3.axisLeft(yLinearScaleSc).tickSize(-widthScatter).tickFormat('').ticks(6);

    // chartGroupScatter.append("g")
    //             .attr('class', 'y axis-grid')
    //             .call(yAxisGrid)
    
 
    // append x axis
    var xAxisSc = chartGroupScatter.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${heightScatter})`)
        .call(bottomAxisSc);

    // append y axis
    chartGroupScatter.append("g")
                .call(leftAxisSc);

    

    // append initial circles
    var circlesGroup = chartGroupScatter.selectAll("circle")
            .data(scatterData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScaleSc(d[chosenXAxis]))
            .attr("cy", d => yLinearScaleSc(d.number_of_restaurants))
            .attr("r", 10)
            .attr("fill", "#7268A6")
            .attr("opacity", ".7");

    // Create group for three x-axis labels
    var labelsGroup = chartGroupScatter.append("g")
    .attr("transform", `translate(${widthScatter / 2}, ${heightScatter + 20})`);

    var avgIncomeLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("value", "average_income") // value to grab for event listener
      .classed("active", true)
      .text("Average Income");

    var medIncomeLabel = labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("value", "median_income") // value to grab for event listener
      .classed("inactive", true)
      .text("Median Income");

    var avgCrimeRate = labelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 55)
    .attr("value", "total_average_crime_rate") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Crime Rate")

    // append y axis
    chartGroupScatter.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - marginScatter.left)
        .attr("x", 0 - (heightScatter / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .text("Number of Restaurants");

    updateToolTip(chosenXAxis, circlesGroup)

    // updateToolTip function above json import
    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    // x axis labels event listener
    labelsGroup.selectAll("text").on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above json import
        // updates x scale for new data
        xLinearScaleSc = xScale(scatterData, chosenXAxis);

        // updates x axis with transition
        xAxisSc = renderX(xLinearScaleSc, xAxisSc);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScaleSc, chosenXAxis);

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

    

