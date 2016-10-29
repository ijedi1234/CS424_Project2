function drawStars() {
	var panel = App.starOverview;

	var margin = 10;

	var innerRadius = 10;
	var outerRadius = (d3.min([panel.width, panel.height]) / 2) - margin;

	var starIDs = Object.keys(App.exoplanetData);
	var numStars = starIDs.length;

	starIDs = starIDs.filter((d) => {
		return App.exoplanetData[d]["st_dist"] < 2757.8792493946735;
	});

	// use "st_dist" to display stars
	var distanceScale = d3.scaleLog()
		.domain(d3.extent(starIDs, (d) => {
			var val = +App.exoplanetData[d]["st_dist"];
			return val + 0.01;
		}))
		.range([innerRadius, outerRadius]);

	var massScale = d3.scaleLinear()
		.domain(d3.extent(starIDs, (d) => {
			return +App.exoplanetData[d]["st_mass"];
		}))
		.range([0.5, 4]);

	// used to center objects
	var translateGroup = panel.svg.append("g")
		.attr("transform", "translate(" + (panel.width / 2) + ", " + (panel.height / 2) + ")");

	// used to zoom/pan
	var zoomGroup = panel.svg.append("g")
		.attr("transform", "scale(1)");

	var zoom = d3.zoom()
		.scaleExtent([1, 20])
		.extent([[0, panel.width],[0, panel.height]])
		.on("zoom", zoomed);

	function zoomed() {
		zoomGroup.attr("transform", d3.event.transform);

		// console.log(d3.event, d3.event.transform);
		var scale = d3.event.transform.k;
		var x = d3.event.transform.x;
		var y = d3.event.transform.y;

		App.updateThumb((panel.width / 2) + x - (panel.width / (2 * scale)),
			(panel.height / 2) + y - (panel.height / (2 * scale)),
			scale);
	}

	panel.svg.call(zoom);

	zoomGroup.append("circle")
		.attr("r", massScale(1))
		.style("fill", "yellow");

	// inner bound of range
	zoomGroup.append("circle")
		.attr("r", innerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

	// outer bound of range
	zoomGroup.append("circle")
		.attr("r", outerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

	var starIDsSorted = starIDs.slice().sort((a, b) => {
		return +App.exoplanetData[b]["st_dist"] - +App.exoplanetData[a]["st_dist"]
	});

	zoomGroup.selectAll(".starPoint")
		.data(starIDs)
	.enter().append("circle")
		.datum((d) => {
			return App.exoplanetData[d];
		})
		.attr("r", (d) => {
			return massScale(+d["st_mass"]);
		})
		.attr("cx", (d, i) => {
			return (distanceScale(+d["st_dist"] + 0.01) * Math.cos(200 * Math.PI * (i / numStars)));
		})
		.attr("cy", (d, i) => {
			return (distanceScale(+d["st_dist"] + 0.01) * Math.sin(200 * Math.PI * (i / numStars)));
		})
		.style("fill", "white")
    .attr("class", "starCircle");

	// create selection arcs

	// inner bound of range
	zoomGroup.append("circle")
		.attr("r", innerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

	// outer bound of range
	zoomGroup.append("circle")
		.attr("r", innerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);


    zoomGroup.selectAll(".starCircle")
       .on("click", function(d, i){
           console.log(i);
           console.log(starIDs[i]);
           console.log(d);
           console.log("selectCount: " + selectCount);
           if(selectCount < 8 && selectCount >= 0){
             updateStarComparison(starIDs[i], d);
             selectCount++;
           }

           /*drawExpandedPie(App.exoplanetData["BD-06 1339"], "BD-06 1339", App.starPlanet.svg);
           drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 0);*/

           updateCascadingPie(starIDs[i], App.exoplanetData[starIDs[i]], 0);

           //drawPie(App.exoplanetData[starIDs[i]], starIDs[i], App.starPlanet.svg);
       });

}
