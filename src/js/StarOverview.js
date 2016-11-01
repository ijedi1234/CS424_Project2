function drawStars() {
	var panel = App.starOverview;

	var margin = 10;

	var innerRadius = 1;
	var outerRadius = (d3.min([panel.width, panel.height]) / 2) - margin;

	var starIDs = Object.keys(App.exoplanetData);
	var numStars = starIDs.length;

	starIDs = starIDs.filter((d) => {
		return App.exoplanetData[d]["st_dist"] && +App.exoplanetData[d]["st_dist"] < 2757.8792493946735;
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
		.range([2, 6]);

	// used to zoom/pan
	var zoomGroup = panel.svg.append("g")
		.attr("transform", "translate(" + (panel.width / 2) + ", " + (panel.height / 2) + ")" + "scale(1)");

	var zoom = d3.zoom()
		.scaleExtent([1, 50])
		.translateExtent([[(panel.width / -2), (panel.height / -2)],[(panel.width / 2), (panel.height / 2)]])
		.on("zoom", zoomed);

	function zoomed() {
		zoomGroup.attr("transform", d3.event.transform);

		var scale = d3.event.transform.k;
		var x = d3.event.transform.x;
		var y = d3.event.transform.y;

		App.updateThumb(panel.width - (x / scale),
			panel.height - (y / scale),
			scale);

		d3.select(".sun")
			.attr("r", massScale(1) / scale);

		d3.selectAll(".starPoint")
			.attr("r", (d) => {
				return massScale(+d["st_mass"]) / scale;
			});
	}

	panel.svg.call(zoom);

	zoomGroup.append("circle")
		.attr("class", "sun")
		.attr("r", massScale(1))
		.style("fill", "yellow");

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
		.attr("class", "starPoint")
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
		.on("click", function(d, i){
				console.log(i);
				console.log(starIDs[i]);
				console.log(d);
				console.log("selectCount: " + selectCount);
				if(selectCount < 8 && selectCount >= 0){
					updateStarComparison(starIDs[i], d);

					var planets = [];
					/*planets.push({ 
					    pl_hostname: "null" ,
					    pl_letter: "null",
					    pl_orbper: "0",
					    pl_rade: "0",
					    pl_orbeccen: "0",
					    pl_orbincl: "0",
					    pl_dens: "0",
					    pl_disc: "1960"
					});*/

					starComparisonArr.forEach(el => {
						App.exoplanetData[el].planets.forEach(p => {
							planets.push(p);
						});
					});

					drawPlanetCompare(planets);

					selectCount = starComparisonArr.length;
				}

				/*drawExpandedPie(App.exoplanetData["BD-06 1339"], "BD-06 1339", App.starPlanet.svg);
				drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 0);*/

				updateCascadingPie(starIDs[i], App.exoplanetData[starIDs[i]], 0);

				//drawPie(App.exoplanetData[starIDs[i]], starIDs[i], App.starPlanet.svg);
		});

}

function filterPlanets(option) {
	var value = +option.value;

	App.starOverview.svg.selectAll(".starPoint")
		.style("opacity", (d) => {
			return d.planets.length >= value ? 1 : 0.1;
		})
		.style("pointer-events", (d) => {
			return d.planets.length >= value ? "initial" : "none";
		});
}
