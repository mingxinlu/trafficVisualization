
// helper functions.

function get_total_(d, i, columns) {
    for (i = 4, t = 0; i < columns.length; ++i) {t += d[columns[i]] = +d[columns[i]];}
	d.total = t;
    return d;
}
function get_total__(d, i, columns) {
    for (i = 3, t = 0; i < columns.length; ++i) {t += d[columns[i]] = +d[columns[i]];}
	d.ALL = t;
    return d;
}
function get_total___(d, i, columns) {
    for (i = 3, t = 0; i < columns.length; ++i) {t += d[columns[i]] = +d[columns[i]];}
	d.ALL = t;
    return d;
}



// update county graph when triggered.
// country graph is pre-defined. Only need to control opacity to show needed one.
function update_county(ID){
	// state_info.text(d.properties.name)
	county_path.attr('display', 'none');
	var temp = county_path
	.filter(function(local, i){
		return local.properties.STATE == ID; 								
	})
	.attr('opacity', 1)
	.attr('display', 'inline')
	.on('click', function(d2, i){
		toolTip_county.style("display", "none");
		/* set form value and plot in plot.js*/
		$("#county-name").attr('placeholder', d2.properties.NAME);
		if (Mode == "County"){
			Plot_bar_chart.draw_type_chart($("#State_form option:selected").val(), d2.properties.NAME,$("#Traffic_Type option:selected").text(),Mode);
			Plot_pie_chart.draw_pie_chart($("#State_form option:selected").val(), d2.properties.NAME)
		}
		/*************/
	})
	.on('mouseover', function(d2, i){
		var width1 = parseFloat(d3.select(".Left_Bottom").style("width"));
		var width2 = parseFloat(d3.select(".Map1").style("width"));
		var width3 = parseFloat(d3.select(".Map2").style("width"));
		toolTip_county
		.attr('transform','translate('+width2/4+', 20)')
		.style("display", "inline");
		toolTip_county.transition()
		.style('opacity', 1)
		.style('left', width1+width2+width3/2+ 'px')
		.style('top', 200 + 'px')
		.style('font-size', 20)
		if(d2.properties.NAME != null || d2.properties.NAME != undefined){
			toolTip_county.html(d2.properties.NAME )	
		} else {
			toolTip_county.html("")	
		}
	})
	.on('mouseleave', function(){
		toolTip_county.style("display", "none");
	});
}



// get the range of data[ptr]
function get_ramp(data,ptr){
	var minVal = 1;
	var maxVal = d3.max(data, function(d) { return d[ptr]; });
	var ramp = d3.scaleLog().domain([minVal,maxVal]).range([lowColor,highColor]);
	return ramp;
}

// update/generate state graph when triggered.
// need to generate a new state graph in the process.
function draw_state(states){
			var width = parseFloat(d3.select("#SVG_map1").style("width"));
			var height = parseFloat(d3.select("#SVG_map1").style("height"));
			projection = d3.geoEquirectangular()
			.fitExtent([[0,0], [width, height]], states);
			
			geoGenerator = d3.geoPath()
			.projection(projection);
			
			var firstpart = d3.select('svg')
			//.attr('transform', 'translate (50,10)')
			.append('g')
			

			var pathgroup = firstpart
			.selectAll('g')
			.data(states.features)
			.enter()
			.append('g');
			path = pathgroup
			.append('path')
			.attr('d', geoGenerator)
			.attr('id',function(d) {
				return d.properties.name;
			})
			.attr('fill','#ddd')
			.on('click', function(d, i){
				state_info.text(d.properties.name)
				toolTip_state.style("display", "none");
				/* set form value and plot in plot.js*/
				$("#State_form").val(state2abrr[d.properties.name][0]);
				$("#county-name").attr('placeholder', 'ALL');
				Plot_bar_chart.draw_type_chart($("#State_form option:selected").val(), 'ALL',$("#Traffic_Type option:selected").text(),Mode);
				Plot_pie_chart.draw_pie_chart($("#State_form option:selected").val(),'ALL')
				/*************/				
				/****plot county based on state click */
				update_county(d.id);
				County_Color(d.id,State=state2abrr[d.properties.name][0],duration=$("#Duration_form option:selected").val(),Type=$("#Traffic_Type option:selected").text());
			})
			.on('mouseover', function(d, i){
				var width1 = parseFloat(d3.select(".Left_Bottom").style("width"));
				var width2 = parseFloat(d3.select(".Map1").style("width"));

				toolTip_state.style("display", "inline");
				toolTip_state.transition()
		  		.style('opacity', .9)
		  		.style('left', width1+width2/2+ 'px')
		  		.style('top', 100 + 'px')  
				// tempColor = this.style.fill; //store current color
				if(d.properties.name != null || d.properties.name != undefined){
					toolTip_state.html(d.properties.name )	
				} else {
					toolTip_state.html("")	
				}			})
			.on('mouseleave', function(d, i){
				toolTip_state.style("display", "none");
			});
			path.filter((d) => {return d.properties.name in {'Alaska':0, 'Hawaii':0}})
			.remove();			
			d3.select('svg')
			.append('g')
			.selectAll	('text')
			.data(states.features)
			.enter()
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.attr('opacity', 0.5)
			.text(function(d) {
				//return d.properties.name;
				return state2abrr[d.properties.name][0];
				
			})
			.attr('transform', function(d) {
				var center = geoGenerator.centroid(d);
				return 'translate (' + center + ')';
			});
}



// generate county graph when initialization.
function draw_county(counties){
					var width = parseFloat(d3.select("#SVG_map2").style("width"));
					var height = parseFloat(d3.select("#SVG_map2").style("height"));

					d3.select('#SVG_map2').append('rect')
					//.attr('x',700).attr('y',35)
					.attr('width',width).attr('height',height).attr('fill', '#fff')

					state_info = d3.select('#SVG_map2').append('text').text('Alabama').attr('transform','translate('+width/4+', 20)').attr('font-size', 25).attr('font-family',"Open Sans");
					
					
					var projection_c = d3.geoEquirectangular()
					.fitExtent([[0,0], [width*30, height*30]], counties);

					geoGenerator_c = d3.geoPath()
					.projection(projection_c);
					var firstpart = d3.select('#SVG_map2')
					.append('g')
					var temp = new Array();
					var count = new Array();
					var pathgroup = firstpart
					.selectAll('g')
					.data(counties.features)
					.enter()
					.append('g');
					county_path = pathgroup
					.append('path')
					.attr('d', geoGenerator_c)
					.attr('id',function(d) {
						return d.properties.name;
					})
					// .attr('opacity', 0)
					.attr('fill','#ddd')
					.attr('transform', function(d,i){
						if (!(d.properties.STATE in temp)){
							temp[d.properties.STATE] = [0,0];
							count[d.properties.STATE] = 0;
						}
						center = geoGenerator_c.centroid(d);
						temp[d.properties.STATE][0] += center[0];
						temp[d.properties.STATE][1] += center[1];
						count[d.properties.STATE] += 1;
					})
					.attr('transform',function(d, i){
						var center = geoGenerator_c.centroid(d);
						center[0] = - temp[d.properties.STATE][0] /  count[d.properties.STATE]+width/2	;
						center[1] = - temp[d.properties.STATE][1] /  count[d.properties.STATE] +height/2;
						return 'translate (' + center + ')';
					}
		)

}

// fill the state graph.
// use get_ramp in the process.
function State_Color(duration="ALL",Type="ALL",Map_mode='Type'){
	var data 
		var statedata = {};
		if (Map_mode == 'Type'){
			data = type_dist;
			filter_obj = duration;
			attrib = "duration" 
			dict_objective = Type;
		}
		else{
			data = du_dist;
			filter_obj = Type;
			attrib = "RefinedType"
			dict_objective = duration;
		}
		new_data = data.filter(function(d){
			return d.County == 'ALL' && d[attrib]==filter_obj;
		})
		for(var i = 0; i < new_data.length; i++){
			statedata[new_data[i].State] = new_data[i][dict_objective];
		}
		var ramp = get_ramp(new_data,dict_objective);
		path
		.attr("fill", function(d,i) {
			var ret_val =  (statedata[state2abrr[d.properties.name][0]]!=null) ? ramp(statedata[state2abrr[d.properties.name][0]]):lowColor;
			return ret_val;
		 });	 	
}


// fill the county graph.
// use get_ramp in the process.
function County_Color(ID="01",State='AL', duration="ALL",Type="ALL",Map_mode='Type'){
	//var data = (Map_mode=="Type") ?type_dist : du_dist;
	data = type_dist;
	var countydata = {};
	new_data = data.filter(function(d){
		return d.State==State && d.County != 'ALL' && d.duration==duration;
	})
	
	for(var i = 0; i < new_data.length; i++){
		countydata[new_data[i].County] = parseInt(new_data[i][Type]);
	}
	
	var ramp = get_ramp(new_data,Type);

	var select_county = county_path
	.filter(function(d){
		
		return d.properties.STATE == ID;
	})
	select_county
	.attr("fill", function(d) { var ret_val = (countydata[d.properties.NAME]!=null) ? ramp (countydata[d.properties.NAME]): lowColor;return ret_val;})
}


// generate bubble map when triggered.
function make_bubble_map(Map_mode="Type", ptr = 'Accident'){
					var data = (Map_mode == "Type")? type_dist_City:du_dist_City;
					ptr = (ptr=="ALL") ? "total":ptr;
					d3.selectAll("#bubbles_on_map")
					.remove()
					.exit();
					d3.selectAll("#legend_bubbles")
					.remove()
					.exit();
					var temp = 0.0;
					for(d in data){
						if(data[d][ptr] > 0)
							{temp = Math.max(temp, data[d][ptr]);}
					}
					var radius = d3.scaleSqrt()
						.domain([0, temp])
						.range([0,20]);
					data = data.sort(function(a, b) {
								return b[ptr] - a[ptr];
						}).slice(0,500)
					.sort(function(a, b){
								return a[ptr] - b[ptr];
						});
					colors = ["Blue", "#CCAD69", "#BACC69", "#88CC69", "#69CC7B", "#69CCAD"]
					var bubbles = d3.select('#SVG_map1').append("g").attr("id","bubbles_on_map")
					.selectAll("circle")
					.data(data)
					.enter().append("circle") 
					.attr('fill', function(d, i){
							if(499 - i < 5){return "Blue"}
							else if(499 - i < 20){return "#CCAD69"}
							else if(499 - i < 50){return "#BACC69"}
							else if(499 - i < 100){return "#88CC69"}
							return "#69CC7B";
					})
		   			.on('mouseover', function(d, i){
						d3.select(this).attr('opacity', 0.9)
						toolTip_city.style("display","inline");
							
						toolTip_city.transition()
						.style('opacity', .9)
						.style('left', (d3.event.pageX) + 'px')
						.style('top', (d3.event.pageY) + 'px')  
						tempColor = this.style.fill; //store current color
			
						if(d.City != null || d.City != undefined){
							toolTip_city.html(d.City + ", " + d[ptr])	
						} else {
							toolTip_city.html("")	
						}
					})
					.on('mouseout', function(d, i){
						toolTip_city.style("display","none");
						d3.select(this)
						 .transition().delay(400).duration(800)
						 .style('opacity', 1)
						 .style('fill', tempColor)
						d3.select(this).attr('opacity', 0.6)
					})
					.attr("cx", function(d,i){return projection([d.mid_lng, d.mid_lat])[0];})
	        		.attr("cy",function(d,i){return projection([d.mid_lng, d.mid_lat])[1];})
					.attr("r", function(d) {
						return radius(d[ptr]); })
					bubble_selector = d3.select('#SVG_map1').append('g').attr("id","legend_bubbles");
					temp = ['top 5','6-20','20-50','50-100','100-500','All', 'None'];
					bubble_selector.selectAll('text').data(temp)
					.enter().append('text')
					.attr('font-size','11px')
					.text(function(d,i){
							return d;
					})
					.attr('transform', (d, i)=>{
							return 'translate(40,'+(323 + 17 * i )+')'
					})
					.attr('opacity', 0.7)
					temp.pop()
					temp.pop()
					bubble_selector.selectAll('circle').data(temp)
					.enter().append('circle')
					.attr('r','5').attr('transform', (d, i)=>{
							return 'translate(20,'+(320 + 17 * i )+')'
					}).attr('fill',(d, i) => colors[i])
					.on('click',function(d, i){
							bubbles.attr('display','inline')
							bubbles.filter(function(){
								return d3.select(this).attr('fill')!= colors[i];
							}).attr('display', 'none')
					})
					bubble_selector.append('circle')
					.attr('r', 7)
					.attr('fill','#fff')
					.attr('transform', 'translate(20,405)')
					.on('click',function(d, i){
							bubbles.attr('display','inline')
					})
					bubble_selector.append('circle')
					.attr('r', 7)
					.attr('fill','#555')
					.attr('transform', 'translate(20,422)')
					.on('click',function(d, i){
							bubbles.attr('display','none')
					})
					bubble_selector.append('text').text('Top Cities').attr('transform','translate(20,450)')
}
	// define global values
	var path;
	var	county_path;
	var geoGenerator;
	var projection;
	var toolTip_state;
	var toolTip_county;
	var bubbles;
	var bubble_selector;
	var toolTip_city;
	var lowColor = '#f9f9f9'
	var highColor = '#bc2a66'
	var state_info;// = d3.select('#SVG_map2').append('text').text('Alabama').attr('transform','translate(0, 0)').attr('font-size', 25).attr('font-family',"Open Sans");
					
	// running parts
	toolTip_state = d3.select('.Map1')
			.append('div')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', '#fff')
			.style('opacity', 0)
		  .style('font-family', 'Open Sans')
			.style('z-index', 800);
	toolTip_county = d3.select('.Map2')
			.append('div')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', '#fff')
			.style('opacity', 0)
		  .style('font-family', 'Open Sans')
			.style('z-index', 1000);
	var toolTip_city = d3.select('body')
			.append('div')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', '#fff')
			.style('opacity', 0)
		  	.style('font-family', 'Open Sans')
		  	.style('font-size', '11px')
			.style('z-index', 1000);

	var state2abrr = {};
	var state2abrr2={};
	var States,Counties,type_dist_City,du_dist_City,type_dist,du_dist;


// all d3.csv: get the necessary data from files.
	d3.csv("../Map json files/states.csv",function(data){
					d3.json("../Map json files/us-states.json",function(states){
							States = states;
							

							for(var i = 0; i < data.length; i++){
								state2abrr2[data[i].State] =  [data[i].Abbreviation];
							}
							for (var i=0;i<States.features.length;i++){
								state2abrr[States.features[i].properties.name] = [state2abrr2[States.features[i].properties.name],States.features[i].id];
							}
						

						});
				});

	d3.csv("../Type_dist_All.csv",get_total__,function(error, data){
			type_dist = data;
	});
	d3.csv("../duration_dist_All.csv",get_total___,function(error, data){
		du_dist = data;
	});

	
	d3.csv('../Type_dist_city.csv', get_total_,function(data){
		type_dist_City = data;
	});

	d3.csv('../duration_dist_city.csv', get_total_,function(data){
		du_dist_City = data;
	});
	d3.json('../Map json files/gz_2010_us_county_500k.json')
	.get(function(error1, counties){
		$("#load_text").hide();
		Counties = counties;
		start()
	});

	// intilization for map part.
	function start(){
		draw_county( Counties);
		draw_state( States);
		make_bubble_map();
		State_Color();
		County_Color();
		update_county('01');
		County_Color();
	}
	
	

	

	