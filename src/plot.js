// helper functions
function get_total(d, i, columns) {
    for (i = 3, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}


// plot bar chart.
function Plot_bar_chart(){
    
    // x, y scales generation.
    function setup_scales(data,objective='County'){
        xscale.domain(data.map(function(d,i) { var ret_val = (objective == 'County') ? array[i]:d.County;  return ret_val;}));
        yscale.domain([0, d3.max(data, function(d) {var ret_val = (objective == 'County') ? d[0][1]-d[0][0] : d.total; return ret_val; })]);
    }

    //bar generation.
    function setup_bars(data,objective='County'){				
        var bars = group.selectAll("rect")
            .remove()
            .exit()
        group.append("g")
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d,i) {  var ret_val = (objective == 'County') ? array[i]:d.County; return xscale(ret_val); })
            .attr("y", function(d) { var ret_val = (objective == 'County') ? d[0][1]-d[0][0]:d.total; return yscale(ret_val); })
            .attr("fill","#a05d56")
            .on("mouseover", function(d) { 
                d3.select(this).style('fill-opacity', 0.5);
            })
            .on("mouseout", function() { 
                tooltip_barchart.style("display", "none");
                d3.select(this)
                    .style('fill-opacity', function() {
                        return "";
                    });
            })
            .on("mousemove", function(d) {
                tooltip_barchart
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(function(){var ret_val = (objective == 'County') ? d[0][1]-d[0][0]:d.total; return ret_val; });
            })
            .transition()
            .delay(200)
            .duration(1000)
            .attr("height", function(d) { var ret_val = (objective == 'County') ? d[0][1]-d[0][0]:d.total;
                 return yscale(0) - (yscale(ret_val)); 
            })
            .attr("width", xscale.bandwidth());
    }
    
    // axis generation.
    function setup_axis(y_type,objective="duration"){
        var xAxis = d3.axisBottom(xscale);
        var yAxis = d3.axisLeft(yscale);
        var x_axis = group.selectAll(".x_axis")
            .remove()
            .exit()
        var y_axis = group.selectAll(".y_axis")
            .remove()
            .exit()
        var text = group.selectAll("text")
            .remove()
            .exit();
        group.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0," + (height-40) + ")")
            .text(objective)
            .call(xAxis)
            .selectAll("text")
            .attr("dx", "4em")
            .attr("dy", function(){var ret_val = (objective == 'County') ?"0.5em":"-0.5em"; return ret_val;})
            .attr("transform", function(){var ret_val = (objective == 'County') ?"rotate(45)":"rotate(90)"; return ret_val;})
        
        group.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text(function(){return (objective=="State") ? "County": "Duration";})

        group.append("g")
            .attr("class", "y_axis")
            .attr("x", 20)
            .call(yAxis.ticks(10, "s"))
            .append("text")
            .attr("x", 10)
            .attr("y", -15)
            .attr("fill", "#000");

        group.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(y_type);  
    }


// initialize types.
    function draw_type_chart (State='AL',County='ALL',RefinedType='ALL',objective="State"){
        var new_data;
        if (objective=="County"){
            new_data = CSV_data.filter(function(d){
                return d.State == State && d.County == County &&  d.RefinedType==RefinedType;
            })
            var keys = CSV_data.columns.slice(3);
            new_data = d3.stack().keys(keys)(new_data);
        }
        else{
            new_data = CSV_data.filter(function(d){
                return d.State == State &&  d.RefinedType==RefinedType && d.County!='ALL';
            })
        }
        
        setup_scales(new_data,objective);
        setup_bars(new_data,objective);
        setup_axis(RefinedType+' frequency',objective);

    }
    // change prototype.
    Plot_bar_chart.draw_type_chart=draw_type_chart;

    var svg = d3.select(".Plot_bar").select("svg");
    var margin = {top: 40, right: 20, bottom: 80, left: 60};
    var width =parseInt(svg.style("width"), 10) - margin.left - margin.right;
    var height =parseInt(svg.style("height"), 10)  - margin.top - margin.bottom;
    var group = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xscale = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1);  
    var yscale = d3.scaleLinear()
            .rangeRound([height-40, 0]);
    var color = d3.scaleOrdinal()
            .range(["#ff8c00", "#d0743c" , "#a05d56" , "#6b486b", "#7b6888", "#8a89a6", "#98abc5"]);
    var w_map_legend = 140, h_map_legend = 300;
    var y_legend = d3.scaleLinear()
                .range([h_map_legend, 0])

    var tooltip_barchart = d3.select("body").append("div").attr("class", "toolTip").attr("id","tooltip_barchart");
						
	
    //thiCSV_data;
    var array = ["0 - 15 min", "15 - 30 min","30 - 60 min" , "1 - 2 hours" , "2 - 4:20 hours", "4:20 - 8:50 hours", "8:50  - 17 hours"
    , "17 - 34:10 hours","34:10 hours - 3 days","3 - 5.5 days","5.5 - 11.5 days","> 11.5 days"];
    var CSV_data;
    d3.csv("../duration_dist_All.csv",get_total,function(data){
        CSV_data = data;
        draw_type_chart()
    });
}


// plot pie chart.
function Plot_pie_chart(){
    function setup_legends(){

        var legendRectSize = 18;
        var legendSpacing = 4;
        
        var keys = CSV_data.columns.slice(3);
        var legend = group.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            //.exit()
            //.remove()
            .data(keys.slice())
            .enter().append("g")
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * keys.slice().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });
            //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // Create rectangles for each legend g
        // Pass rect index to Z color ordinal scale
        legend.append("rect")
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)                                   
            .style('fill', color)
            .style('stroke', color)
            .transition()
            .delay(200)
            .duration(1000);

        // Create text for each legend g
        // Use the data that it inherts to create the SVG text
        legend.append("text")
            .attr('x', legendRectSize + legendSpacing+60)
            .attr('y', legendRectSize - legendSpacing)
            .transition()
            .delay(200)
            .duration(1000)
            .text(function(d) { return d; });
       
    }
// initlize/change situation.
    function draw_pie_chart(State='AL',County='ALL',duration='ALL'){
        
        var new_data = CSV_data.filter(function(d){
            return d.State == State && d.County == County && d.duration==duration;
        })
        var keys = CSV_data.columns.slice(3);
        stacked_data = d3.stack().keys(keys)(new_data);
        svg.selectAll("#pie_label").remove();
        svg.append("text").attr("id","pie_label")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height-40) + ")")
        .style("text-anchor", "middle")
        .text("Frequncy in ["+$("#Duration_form option:selected").text()+"] range");//{return (objective=="State") ? "County": "Duration";})
        var bararcs = group.selectAll(".arc")
            .remove()
            .exit()

        var g = group.selectAll(".arc")
            .data(pie(stacked_data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            //.attr("d", arc)
            .on("mouseover", function(d) { 
                d3.select(this).style('fill-opacity', 0.5);
            })
            .on("mouseout", function() { 
                tooltip_piechart.style("display", "none");
                d3.select(this)
                    .style('fill-opacity', function() {
                        return "";
                    });
            })
            .on("mousemove", function(d) {
                tooltip_piechart
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.data.key + "<br>" + (d.data[0][1]-d.data[0][0]));
            })
            .transition().delay(function(d,i) {
                return i * 200; })
            .duration(500)
            .attrTween('d', function(d) {
                    var i = d3.interpolate(d.startAngle, d.endAngle);
                    return function(t) {
                        d.endAngle = i(t); 
                        return arc(d)
                        }
            })
            .style("fill", function(d) { return color(d.data.key); })

        g.append("text")
            .filter(function(d){return (d.endAngle - d.startAngle) > 0.5})
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .transition()
            .delay(1500)
            .text(function(d) { return d.data.key; });

           
    }
    // change prototype.
    Plot_pie_chart.draw_pie_chart=draw_pie_chart;

    var svg = d3.select(".Plot_pie").select("svg");
    var margin = {top:0, right: 0, bottom: 0, left: 0};
    var width =parseInt(svg.style("width"), 10) - margin.left - margin.right;
    var height =parseInt(svg.style("height"), 10)  - margin.top - margin.bottom;
    var radius = Math.min(width, height) / 2;
    var group = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var tooltip_piechart = d3.select("body").append("div").attr("class", "toolTip").attr("id","tooltip_piechart");

    var color = d3.scaleOrdinal(d3.schemeCategory20b);
    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#dd86e4"]);

    var arc = d3.arc()
    .outerRadius(radius * 0.8)
	.innerRadius(radius * 0.5);

    var labelArc = d3.arc()
    .innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {return d[0][1]-d[0][0]; });
    var CSV_data;
    d3.csv("../Type_dist_All.csv", get_total, function(error,data){
        CSV_data=data;
        setup_legends();
        draw_pie_chart(); 
    });
}