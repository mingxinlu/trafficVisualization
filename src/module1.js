
			// define functions
			function draw_state(error, states){
				var width = 2500;
				var height = 2500;
				projection = d3.geoEquirectangular()
				.fitExtent([[-300,-1000], [width-300, height-1000]], states);
				geoGenerator = d3.geoPath()
				.projection(projection);
				var firstpart = d3.select('svg')
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
					county_path.attr('display', 'none');
					var temp = county_path.filter(function(local, i){
						return local.properties.STATE == d.id; 
								}).attr('opacity', 1)
								.attr('display', 'inline')
								.on('click', function(d2, i){
									console.log(d2.properties.NAME);
									$("#county-name").attr('placeholder', d2.properties.NAME);
					});
				})
				.on('mouseover', function(d, i){
					toolTip.transition()
			  		.style('opacity', .9)
			  		.style('left', (d3.event.pageX) + 'px')
			  		.style('top', (d3.event.pageY - 1) + 'px')  
					// tempColor = this.style.fill; //store current color
					if(d.properties.name != null || d.properties.name != undefined){
						toolTip.html(d.properties.name + ", ")	
					} else {
						toolTip.html("")	
				}

				})
				.on('mouseleave', function(d, i){
				});
				path.filter((d) => {
					// if (d.properties.name in ['Alaska', 'Hawaii'])
					console.log('Alaska' in ['Alaska', 'Hawaii'] )

					return d.properties.name in {'Alaska':0, 'Hawaii':0}}).remove();

				;

				texts = d3.select('svg')
				.append('g')
				.selectAll	('text')
				.data(states.features)
				.enter()
				.append('text')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
				.attr('opacity', 0.5)
				.text(function(d) {
					return d.properties.name;
				})
				.attr('transform', function(d) {
					var center = geoGenerator.centroid(d);
					return 'translate (' + center + ')';
				});
				bubble_map('Accident');
			}
			function draw_county(error, counties){
				console.log('here');
				console.log(counties);
				var width = 4000;
				var height = 4000;
				var projection_c = d3.geoEquirectangular()
				.fitExtent([[0,-1000], [width, height-1000]], counties);
				geoGenerator_c = d3.geoPath()
				.projection(projection_c);
				var firstpart = d3.select('svg')
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
					center[0] = - temp[d.properties.STATE][0] /  count[d.properties.STATE]+ 500	;
					center[1] = - temp[d.properties.STATE][1] /  count[d.properties.STATE] + 100;
					return 'translate (' + center + ')';
				}
				 ).attr('opacity', 0)
				.on('click', function(d, i){
					console.log(d);
				})

			}
			function data_inject(file, ptr){
				console.log('here');
				var countydata = {};
				ptr = 'Congestion';
				d3.csv(file,
				 function(error, data){
				 	console.log('here');
					var statedata = new Object();
					forsort = []
				 	for(var i = 1; i < data.length; i++){
				 		rcd = data[i];
					 	if(!(rcd.State in statedata)){
							statedata[rcd.State] = 0;
						}
						statedata[rcd.State] += +rcd[ptr];
						countydata[rcd.County] = rcd[ptr];
				 	}
				 	var temp = Object.keys(statedata).map((d, i) =>[d, statedata[d]])
				 	temp.sort((a,b)=> a[1] - b[1])
				 	len = temp.length;
				 	for(var i = 0; i <= 6; i++ ){
				 		for(var j  = 0 ; j < len / 6; j++){
				 			if(i * ((len / 6) | 0) + j >= temp.length){
				 				break;
				 			}
				 			statedata[temp[i * ((len / 6) | 0) + j][0]] = i;
				 		}
				 	}
				 	temp = Object.keys(countydata).map((d, i) =>[d, countydata[d]])
				 	temp.sort((a,b)=> a[1] - b[1]).map((d, i)=> {
				 		countydata[d[0]] = (i / ((temp.length / 6) | 0))|0})
				 	var county_colors = ["#7e5109","#b7950b","#D4AC0D", "#f4d03f","#f7dc6f","#fcf3cf","#fef9e7"]
				 	county_path.attr('fill', function(d){
				 			return county_colors[countydata[d.properties.NAME]]
					 	})
				 	d3.csv("https://raw.githubusercontent.com/jasonong/List-of-US-States/master/states.csv",function(error, data){
				 		var check = {};
				 		console.log('there')
				 		for(var i = 0; i < data.length; i++){
				 			check[data[i].State] = data[i].Abbreviation;
				 		}
				 		texts.text(function(d) {
					return check[d.properties.name];
						})
				 		console.log(check)
					 	console.log(statedata);
					 	var colors =["#78281F", "#B03A2E", "#E74C3C", "#F1948A", "#F5B7B1", "#FADBD8", "#F9EBEA"].reverse();
					 	path.attr('fill', function(d){
					 		console.log(check[Alabama]);
					 		return colors[statedata[check[d.properties.name]]];
					 	})
					 	
				 	})
				 	

				},
				)
			}
			function bubble_map(ptr){
				d3.csv('../duration_dist_city.csv', function(error, data){
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
					colors = ["Blue", "#CCAD69", "#BACC69", "#88CC69", "#69CC7B", "#69CCAD"]

					var bubbles = d3.select('svg').append("g")
					.attr("class", "bubble")
					.selectAll("circle")
					.data(data)
					.enter().append("circle") 
					.attr('fill', function(d, i){
						if(i < 5){return "Blue"}
						else if(i < 20){return "#CCAD69"}
						else if(i < 50){return "#BACC69"}
						else if(i < 100){return "#88CC69"}
						return "#69CC7B";
					})
	   				.on('mouseover', function(d, i){
						d3.select(this).attr('opacity', '0.9')
					})
					.on('mouseout', function(d, i){
						d3.select(this).attr('opacity', '0.7')
					})
					.attr("cx", function(d,i){return projection([d.mid_lng, d.mid_lat])[0];})
        			.attr("cy",function(d,i){return projection([d.mid_lng, d.mid_lat])[1];})
					.attr("r", function(d) {
						return radius(d[ptr]); })
					d3.select('.bubble').append('g')
					.selectAll('circle').data(['1-5','6-20','20-50','50-100','100-500'])
					.enter().append('circle')
					.attr('r','5').attr('transform', (d, i)=>{
						return 'translate(600,'+(250 + 15 * i )+')'
					}).attr('fill',(d, i) => colors[i])
					.on('mouseover',function(d, i){
						d3.select('.bubble').selectAll('circle').filter(function(){
							return d3.select(this).attr('fill')!= colors[i];
						}).attr('opacity', 0)
					}).on('mouseleave',function(d, i){
						d3.select('.bubble').selectAll('circle').filter(function(){
							return d3.select(this).attr('fill')!= colors[i];
						}).attr('opacity', 0.7)})
					
				}
					)
			}

			
			// define global values
			var texts;
			var path;
			var	county_path;
			var state_value;
			var county_value;
			var geoGenerator;
			var projection;
			var toolTip;
			// running parts
			toolTip = d3.select('body')
					.append('div')
					.attr('class','toolTip')
					.style('position', 'absolute')
					.style('padding', '0 10px')
					.style('background', '#fff')
					.style('opacity', 0)
				  .style('font-family', 'Open Sans')
					.style('z-index', 1000);

			d3.json('../Map json files/gz_2010_us_county_500k.json', function(error1, counties){
    			d3.json("../Map json files/us-states.json", function(error2, states){
    				console.log(counties);
    				draw_county(error1, counties);
    				draw_state(error2, states);

					data_inject('../Type_dist.csv', 'All');

    			});
			})