var margin = {
  top: 20,
  right: 30,
  bottom: 30,
  left: 40
},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// scale to ordinal because x axis is not numerical
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

//scale to numerical value by height
var y = d3.scale.linear().range([height, 0]);

var chart = d3.select("#chart")
.append("svg") //append svg element inside #chart
.attr("width", width + (2 * margin.left) + margin.right) //set width
.attr("height", height + margin.top + margin.bottom); //set height
var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom"); //orient bottom because x-axis will appear below the bars

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var url = '/api/restaurant/annex'
d3.json(url, function(error, data) {
x.domain(data.map(function(d) {
  return d.category
}));
y.domain([0, d3.max(data, function(d) {
  return d.num_restaurants_ca
})]);

var bar = chart.selectAll("g")
  .data(data)
  .enter()
  .append("g")
  .attr("transform", function(d, i) {
    return "translate(" + x(d.category) + ", 0)";
  });

bar.append("rect")
  .attr("y", function(d) {
    return y(d.num_restaurants_ca);
  })
  .attr("x", function(d, i) {
    return x.rangeBand() + (margin.left / 2);
  })
  .attr("height", function(d) {
    return height - y(d.num_restaurants_ca);
  })
  .attr("width", x.rangeBand()); //set width base on range on ordinal data

bar.append("text")
  .attr("x", x.rangeBand() + margin.left)
  .attr("y", function(d) {
    return y(d.num_restaurants_ca) - 10;
  })
  .attr("dy", ".75em")
  .text(function(d) {
    return d.num_restaurants_ca;
  });

chart.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + margin.left + "," + height + ")")
  .call(xAxis);

chart.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + margin.left + ",0)")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("num_restaurants_ca");
});

function type(d) {
d.receive_date = +d.category; // coerce to number
return d;
}