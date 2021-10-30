//set chart
var svgWidth = 800;
var svgHeight = 500;

//set margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// SVG Wrapper, append SVG group to hold chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("viewBox", `0 0 800 500`)


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  

  // Import Data
  d3.csv("./assets/js/data.csv").then((demographicData) => {

      // Parse Data/Cast as numbers
      // ==============================
    demographicData.forEach(function (data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });


      //Create Scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(demographicData, d => d.smokes) + 10])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(demographicData, d => d.age)])
      .range([height, 0]);

      //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

      //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(demographicData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.smokes))
      .attr("cy", d => yLinearScale(d.age))
      .attr("r", "20")
      .attr("fill", "#FF0266")
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .attr("opacity", ".35");

    

    // add text element to circles
  var c_label = chartGroup.selectAll(null).data(demographicData).enter().append("text");
  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "smokes") {
    label = "Smoker (%)";
  }
  

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[smokes]}`);
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
  //add label to circles
  c_label
    .attr("x", function(d) {
    return xLinearScale(d.smokes);
   })
    .attr("y", function(d) {
    return yLinearScale(d.age);
    })
    .text(function(d) {
    return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "black");

//add labels to axes
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Age");

chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Smokers(%)");

    }).catch(function(error) {
    console.log(error);
    });


  