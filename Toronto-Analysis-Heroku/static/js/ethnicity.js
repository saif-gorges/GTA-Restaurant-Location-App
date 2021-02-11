//Plotting using Plotly
// Load Data
var url = '/api/ethnicity/annex'

d3.json(url).then(function(data) {

 // Cast the population value to to a number for each piece of data
    var ethnicityName = Object.keys(data[0]);
    // console.log(data);
    // console.log(Object.keys(data[0]));
    var population = Object.values(data[0]);

    var trace = {x : ethnicityName,
                y: population,
                type: 'bar',
                marker: {
                  color: '#ffd966',
                  line: {width:0.5}
                  }
                };

    var layout = {
      font: {size: 10},
      height: 700,
      width: 500,
      yaxis: {title : "Population"},
      xaxis: {title : "Ethnicity", automargin: true},
      //automargin: true
      fixedrange: true
    }

    var data = [trace];

    Plotly.newPlot('ethnicity-plot', data, layout, {displayModeBar: true});

});


// //D3 plotting -> Can't plot array without specific column(key)name. 
// //SVG Setting
// var svgWidth = 600;
// var svgHeight = 900;

// var margin = {
//     top: 30,
//     right: 30,
//     bottom: 100,
//     left: 70
//   };
  
// // Define dimensions of the chart area
// var chartWidth = svgWidth - margin.left - margin.right;
// var chartHeight = svgHeight - margin.top - margin.bottom;

// // Select body, append SVG area to it, and set the dimensions
// var svg = d3.selectAll("#ethnicity-plot")
//     .append("svg")
//     .attr("height", svgHeight)
//     .attr("width", svgWidth);

// // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Load Data
// var url = '/api/ethnicity/annex'

// d3.json(url).then(function(data) {

//  // Cast the population value to to a number for each piece of data
//     var ethnicityName = Object.keys(data[0]);
//     // console.log(data);
//     // console.log(Object.keys(data[0]));
//     var population = Object.values(data[0]);
//       console.log(ethnicityName);
//       console.log(population);
    
//     // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
//     var xBandScale = d3.scaleBand()
//     .domain(ethnicityName)
//     .range([0, chartWidth])
//     .padding(0.1);
//     // console.log(Object.values(data[0]));
 
//     // Create a linear scale for the vertical axis.
//     var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(population)])
//     .range([chartHeight, 0]);

//     // Create two new functions passing our scales in as arguments
//     // These will be used to create the chart's axes
//     var bottomAxis = d3.axisBottom(xBandScale);
//     var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

//      // Append two SVG group elements to the chartGroup area,
//     // and create the bottom and left axes inside of them
//     chartGroup.append("g")
//     .call(leftAxis);

//     chartGroup.append("g")
//     .attr("transform", `translate(0, ${chartHeight})`)
//     .call(bottomAxis)
//     .selectAll("text")
//         .attr("transform", "translate(-10,0)rotate(-30)")
//         .style("text-anchor", "end");
   
//    // Create one SVG rectangle per piece of tvData
//     // Use the linear and band scales to position each rectangle within the chart
//     chartGroup.selectAll(".bar")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", xBandScale(Object.keys(data[0])))
//     .attr("y", yLinearScale(Object.values(data[0])))
//     .attr("width", xBandScale.bandwidth())//
//     .attr("height", chartHeight - yLinearScale(Object.values(data[0])));

//     }).catch(function(error) {
//     console.log(error);
  
// });