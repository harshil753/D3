var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Configure a band scale, with a range between 0 and the chartWidth and a padding of 0.1 (10%)
var xBandScale = d3.scaleBand().range([0, width]).padding(0.1);

// Create a linear scale, with a range between the chartHeight and 0.
var yLinearScale = d3.scaleLinear().range([height, 0]);

// import data.csv 
d3.csv("data.csv", function(error, healthData) {
    if (error) throw error;
    console.log(healthData);

    healthData.forEach(function(data) {
        data.bachelors =+ data.bachelors;
        data.exercise =+ data.exercise;
    });

      // Create scale functions
    var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
    .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      // Scale the domain
    xLinearScale.domain([0, 100]);

    yLinearScale.domain([0, 100]);
    
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
        var state = data.state;
        var exercise = +data.exercise;
        var bachelors = +data.bachelors;
        return (state + "<br> Regularly Exercise %: " + exercise + "<br> Have Bachelors%: " + bachelors);
        });
    
    chart.call(toolTip);

    chart.selectAll("circle")
    .data(healthData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.bachelors);
        return xLinearScale(data.bachelors);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.exercise);
      })
      .attr("r", "15")
      .attr("fill", "grey")
      .style("opacity", .75)
      .attr("stroke", "black")
      .on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% of People Who Exercise Regularly");

    // Append x-axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axisText")
        .text("% of People Who Have Atleast a Bachelor's Degree");
});
