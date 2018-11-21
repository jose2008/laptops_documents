var margin = {top: 10, left: 30, bottom: 20, right: 10};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var numberOfPoints = 100;
var pointRadius = 9;

d3.json('data2.json', function(data) {
    var labels = d3.set(data.map(function(d) {
        return d.label;
    })).values();

    var xExtent = d3.extent(data, function(d) { return d.x });
    var yExtent = d3.extent(data, function(d) { return d.y });
    var xRange = xExtent[1] - xExtent[0];
    var yRange = yExtent[1] - yExtent[0];

    //document.write(xRange);

    var xScale = d3.scale.linear()
        .domain([xExtent[0] - xRange*0.1, xExtent[1] + xRange*0.1])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([yExtent[0] - yRange*0.1, yExtent[1] + yRange*0.1])
        .range([height, 0]);

    var colourScale = d3.scale.ordinal()
        .domain(labels)
        .range(['#e41a1c', '#377eb8', '#4daf4a']);

    var shapeScale = d3.scale.ordinal()
        .domain(labels)
        .range([d3_shape.symbolCircle, d3_shape.symbolCross,
            d3_shape.symbolSquare]);

    var svg = d3.select('#container').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('position', 'absolute')
        .style('z-index', 1)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," +
            margin.top + ")");



        // Lasso functions to execute while lassoing
var lasso_start = function() {
  lasso.items()
    .attr("r",3.5) // reset size
    .style("fill",null) // clear all of the fills
    .classed({"not_possible":true,"selected":false}); // style as not possible
};

var lasso_draw = function() {
  // Style the possible dots
  lasso.items().filter(function(d) {return d.possible===true})
    .classed({"not_possible":false,"possible":true});

  // Style the not possible dot
  lasso.items().filter(function(d) {return d.possible===false})
    .classed({"not_possible":true,"possible":false});
};

var lasso_end = function() {
  // Reset the color of all dots
  lasso.items()
     .style("fill", function(d) { return color(d.species); });

  // Style the selected dots
  lasso.items().filter(function(d) {return d.selected===true})
    .classed({"not_possible":false,"possible":false})
    .attr("r",7);

  // Reset the style of the not selected dots
  lasso.items().filter(function(d) {return d.selected===false})
    .classed({"not_possible":false,"possible":false})
    .attr("r",3.5);

};

// Create the area where the lasso event can be triggered
var lasso_area = svg.append("rect")
                      .attr("width",width)
                      .attr("height",height)
                      .style("opacity",0);

// Define the lasso
var lasso = d3.lasso()
      .closePathDistance(75) // max distance for the lasso loop to be closed
      .closePathSelect(true) // can items be selected by closing the path?
      .hoverSelect(true) // can items by selected by hovering over them?
      .area(lasso_area) // area where the lasso can be started
      .on("start",lasso_start) // lasso start function
      .on("draw",lasso_draw) // lasso draw function
      .on("end",lasso_end); // lasso end function

// Init the lasso on the svg:g that contains the dots
svg.call(lasso);







    var canvas = d3.select('#container').append('canvas')
        .attr('width', width - 1)
        .attr('height', height - 1)
        .style('position', 'absolute')
        .style('z-index', 2)
        .style("transform", "translate(" + (margin.left + 1) +
            "px" + "," + (margin.top + 1) + "px" + ")");

    var context = canvas.node().getContext('2d');

    d3.select("#container")
        .style("width", width + margin.left + margin.right + 'px')
        .style("height", height + margin.top + margin.bottom + "px");

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .innerTickSize(-width)
        .outerTickSize(0)
        .orient('left');

    var xAxisSvg = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    var yAxisSvg = svg.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    // create zooming/panning behaviour
    var zoomBehaviour = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([1, 5])
        .on('zoom', onZoom);

    //canvas.call(zoomBehaviour);

    // add legend
    var legendWidth = 100;
    var legendHeight = 90;

    var legend = d3.select('#legend').append('svg')
        .attr('width', legendWidth)
        .attr('height', legendHeight);

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    labels.forEach(function(d, i) {
        var x = pointRadius + 10;
        var y = 23 + i * 20;

        var symbol = d3_shape.symbol()
            .type(shapeScale(d))
            .size(pointRadius * pointRadius);

        legend.append('path')
            .attr('d', symbol)
            .attr('fill', colourScale(d))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('transform', 'translate(' + x + ',' + y + ')');

        legend.append('text')
            .attr('class', 'legend')
            .attr('x', pointRadius + 20)
            .attr('y', y)
            .attr('dominant-baseline', 'central')
            .text(d);
    });

       draw();

    // draw points
    function draw() {
        console.log('draw');

        context.clearRect(0, 0, width, height);

        data.forEach(function(d) {
            var x = Math.round(xScale(d.x));
            var y = Math.round(yScale(d.y));

            var symbol = d3_shape.symbol()
                .type(shapeScale(d.label))
                .size(pointRadius * pointRadius)
                .context(context);

            context.translate(x, y);
            //document.write(d.label)
            context.fillStyle = colourScale(d.label);
            context.beginPath();
            symbol();
            context.closePath();
            context.fill();
            context.stroke();
            context.translate(-x, -y);
        });
    }





    lasso.items(d3.selectAll(".dot"));




    function onClick(e) {
        console.log('click!!');
    }

    function onZoom() {
        console.log('onZoom');

        draw();
        xAxisSvg.call(xAxis);
        yAxisSvg.call(yAxis);
    }
});
