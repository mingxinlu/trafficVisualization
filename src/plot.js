function get_total(d, i, columns) {
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}

function setup_scales(data,keys){
    xscale.domain(data.map(function(d) { return d.State; }));
    yscale.domain([0, d3.max(data, function(d) { return d.total; })]);
    color.domain(keys);
}
function setup_bars(data,keys){				
    var bars = group.selectAll("rect")
        .remove()
        .exit()
    var txt = group.selectAll("text")
        .remove()
        .exit()
    group.append("g")
        .selectAll("rect")
        .data(data)//function(d) {//console.log(d.Congestion); return d; })*/
        .enter().append("rect")
        .filter(function(d){//console.log(d.Congestion);
           return d.County == 'ALL';})
        .attr("x", function(d) {  return xscale(d.State); })
        .attr("y", function(d) { return yscale(d.total); })
        /*.on("mouseover", function(d) { 
            //var State_selected = d.data.State;
            tooltip.style("display", null);
            d3.select(this).style('fill-opacity', 0.5);
            /*var paths = d3.select('#map').select(".geopath")
                .selectAll('path')
                .transition()
                .delay(200)
                .duration(500)
                .attr("stroke-width", function(d) { 
                    if (d.properties.STUSPS10 == State_selected){
                        return 5; 
                    }
                    else{
                        return 2;
                    }
                })
                .attr("stroke", function(d) { 
                    if (d.properties.STUSPS10 == State_selected){
                        return "black"; 
                    }
                    else{
                        return "";
                    }
                })
                .style("fill-opacity", function(d) { 
                    if (d.properties.STUSPS10 == State_selected){
                        return 1; 
                    }
                    else{
                        return 0.7;
                    }
                });*/
        //    })
        /*.on("mouseout", function() { 
            tooltip.style("display", "none"); 
            d3.select(this)
                .style('fill-opacity', function() {
                    return "";
                });
        })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] + 10;
            var yPosition = d3.mouse(this)[1] + 10;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d[1]-d[0]);
        })*/
        /*.on("click",function(d) { 
            var State_selected = d.data.State;
            var paths = d3.select('#map').select(".geopath")
                .selectAll('path')
                .attr("stroke-width", function(d) { 
                    if (d.properties.STUSPS10 == State_selected){
                        return 15; 
                    }
                    else{
                        return 2;
                    }
                })
                .style("fill-opacity", function(d) { 
                    if (d.properties.STUSPS10 == State_selected){
                        return 1; 
                    }
                    else{
                        return 0.7;
                    }
                });
            })*/
        .transition()
        .delay(200)
        .duration(1000)
        .attr("height", function(d) { return yscale(0)-yscale(d.total); })
        .attr("width", xscale.bandwidth());

}

function setup_legends(keys){
    var legend = group.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .exit()
        .remove()
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // Create rectangles for each legend g
    // Pass rect index to Z color ordinal scale
    legend.append("rect")
        .attr("x", width - 19)
        .transition()
        .delay(200)
        .duration(1000)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    // Create text for each legend g
    // Use the data that it inherts to create the SVG text
    legend.append("text")
        .transition()
        .delay(200)
        .duration(1000)
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
}

function setup_axis(y_type){
    var xAxis = d3.axisBottom(xscale);
    var yAxis = d3.axisLeft(yscale);
    var x_axis = group.selectAll(".x_axis")
        .remove()
        .exit()
    group.append("g")
        .transition()
        .delay(200)
        .duration(1000)
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    var y_axis = group.selectAll(".y_axis")
        .remove()
        .exit()
    group.append("g")
        .attr("class", "y_axis")
        .call(yAxis.ticks(20, "s"))
        .append("text")
        .attr("x", 10)
        .attr("y", -15)
        .attr("fill", "#000")
        .text(y_type);
}

function draw_type_chart(data){
    var keys = data.columns.slice(2);
    setup_scales(data,keys);
    setup_bars(data,keys);
    setup_legends(keys);
    setup_axis('frequency')
}
var svg = d3.select("#Plots"),
        margin = {top: 40, right: 200, bottom: 40, left: 60},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        group = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xscale = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);
    
var yscale = d3.scaleLinear()
        .rangeRound([height, 0]);

var color = d3.scaleOrdinal()
        .range(["#ff8c00", "#d0743c" , "#a05d56" , "#6b486b", "#7b6888", "#8a89a6", "#98abc5"]);

var w_map_legend = 140, h_map_legend = 300;
var y_legend = d3.scaleLinear()
            .range([h_map_legend, 0])

var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
                
tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 30)
    .attr("fill", "white")
    .style("opacity", 1)
tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "15px")
      .attr("font-weight", "bold");

d3.csv("../Type_dist.csv", get_total, function(Type_data){
    draw_type_chart(Type_data)
})
        

        