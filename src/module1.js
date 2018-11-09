
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
				// .attr('opacity', 0)
				.attr('fill','#ddd')
				.on('mouseover', function(d, i){
					county_path.attr('opacity', 0);
					var temp = county_path.filter(function(local, i){
						return local.properties.STATE == d.id; 
					}).attr('opacity', 1);
					var zoom = d3.behavior.zoom();
					temp.call(zoom);
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
				var width = 5000;
				var height = 5000;
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
					center[0] = - temp[d.properties.STATE][0] /  count[d.properties.STATE]+ 600	;
					center[1] = - temp[d.properties.STATE][1] /  count[d.properties.STATE] + 100;
					return 'translate (' + center + ')';
				}
				 ).attr('opacity', 0)
				data_inject('../Type_dist.csv', 'All');

			}
			/*function pie_chart(){
				d3.csv('../Type_dist.csv', function(error, data){
					data = data[0]
					delete data.State
					delete data.County
					console.log(data)
					temp = []
					for(key in data){
						temp.push({'label':key, 'value': data[key]})
					}
					console.log(temp)
					data = temp
					var arc = d3.arc().outerRadius(60).innerRadius(10)
					var colors = d3.scaleOrdinal()
					.range(["#CC7B69", "#CCAD69", "#BACC69", "#88CC69", "#69CC7B", "#69CCAD", "#69BFCC"]
					.reverse());
					// var color = d3.scaleOrdinal().domain(data.map(d => d.name))
    				// .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
					var pie = d3.pie().sort((a,b) => b.value - a.value ).value(function(d){
						return d.value;
					})
					var arcs = pie(data)
					var g = d3.select('svg').append('g')
					.attr('transform','translate(300,500)')
					.selectAll('path')
					.data(arcs)
					.enter()
					.append('path')
					.attr('fill',colors)
					.attr('stroke', 'white')
					.attr('d', arc)
					.append('title')
					.text(d =>`${d.data.name}: ${d.data.value.toLocaleString()}`)

				})	
			}*/
			function bar_chart(){
				d3.csv('../duration_dist.csv',
			function(error, data){
				data = data[0];
				console.log(data);
				arr = []
				// name = []
				for (temp in data){
					arr.push(data[temp])
					// name.push(temp)
				}
				arr = arr.slice(2)
				// name = name.slice(2)
				console.log(arr)
				var height = 200;
			  	g = d3.select('svg').append("g").attr("transform", "translate(" + 100 + "," + 600 + ")").attr('id','bar');
					var y = d3.scaleLinear()
					.domain([0, d3.max(arr,d=>d)])
					.rangeRound([height, 0])
					.nice()
					;
					// translate = {}
				 //  var temp = 0;
				 //  data.map(functionstion(d, i) {
				 //  	temp = Math.max(d.overall, temp)
				 //  })
				 //  data.map(function(d, i) {
				 //  	poses[d.State] = i;
				 //  	translate[d.State] = d.overall / temp * 80;
				 //  });
				 //  // console.log(data)
				 //  x.domain(data.map(function(d) { return d.State; }));
				  // y.nice();
				  width = 10.1
				 padding = 0.1
				  var rect =  g.append("g")
				 .selectAll("rect")
				 .data(arr)
				 .enter()
				 .append("rect")
				 .attr("fill", "#CCAD69")
				  .attr("x", function(d, i) { 
				  	return width * i; })
				  .attr("y", function(d,i) { 
				  	console.log(y(d))
				  	return y(d); })
				  .attr("height", function(d,i) {return y(0) - y(d);})
				  .attr("width", 4)
				  ;
				  }) 	 
				  // ;
		  		//   g.append("g")
				  // .attr("class", "axis")
				  // .attr("transform", "translate(0,"+450+")")
				  // .call(d3.axisBottom(x));

				  // // g.append('rect').attr('x', 0).attr('y', 0).attr('fill', '#000').attr('height', 100).attr('width', 100)

				  // g.append("g")
				  // .attr("class", "axis")
				  // .attr('transform','translate(0,0)')
				  // .call(d3.axisLeft(y))
				  // .append("text").
				  // text("Area")
				  // .attr("x", 60)
				  // .attr("fill", "#000");

				}
			function data_inject(file, ptr){
				// pie_chart();
				// bar_chart();
				var countydata = {};
				ptr = 'Congestion';
				d3.csv(file,
				 function(error, data){
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

				// var arc = d3.svgArc()
				// .outerRadius(radius)

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
						}).slice(0,3000)
					d3.select('svg').append("g")
					.attr("class", "bubble")
					.selectAll("circle")
					.data(
						data
					)
					.enter().append("circle") 
	   				.on('mouseover', function(d, i){
						d3.select(this).attr('class', 'bubbleover')
					})
					.on('mouseout', function(d, i){
						d3.select(this).attr('class', '')
					})
					.attr("cx", function(d,i){return projection([d.mid_lng, d.mid_lat])[0];})
        			.attr("cy",function(d,i){return projection([d.mid_lng, d.mid_lat])[1];})
					.attr("r", function(d) {
						return radius(d[ptr]); })
					
				}
					)
			}

			function controller_construct(){

			}
			
			// define global values
			var text;

			var path;
			var	county_path;
			var state_value;
			var county_value;
			var geoGenerator;
			var projection;
			// running parts
			d3.json('../Map json files/gz_2010_us_county_500k.json', draw_county);
    		d3.json("../Map json files/us-states.json", draw_state);
    		// controler_construct()