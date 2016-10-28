"use strict";

// Main program object. Hang 'global' functions and variables off App
var App = App || {};

// iife to initialize values
(function() {

  // iife global
  var self = this || {};

  App.planetVariables = [];

  App.starVariables = [];

  App.exoplanetData = {};

  let loadStartTime;

  App.loadData = function () {
    loadStartTime = new Date().getTime();
    readPlanetVars();
  }

	App.updateThumb = function(x, y, scale) {
		// since the box will be uniformly scaled in x and y, if it is zoomed into 5x mag, box will be 1/5 size
		var smallBoxWidth = 120;
		var smallBoxHeight = 72;

		var widthRatio = smallBoxWidth/App.starOverview.width;
		var heightRatio = smallBoxHeight/App.starOverview.height;

		d3.select("#smallMapLoc")
			.style("top", (y * heightRatio) + "px")
			.style("left", (x * widthRatio) + "px")
			.style("width", (smallBoxWidth / scale) + "px")
			.style("height", (smallBoxHeight / scale) + "px");

	}

  function readPlanetVars() {
    d3.json("./data/planetVariables.json", function(error, pl_vars) {
      if (error) {
        throw error;
      }

      // after planet variables are readStarVars
      App.planetVariables = pl_vars;
      readStarVars();

    });
  }

  function readStarVars() {
    d3.json("./data/starVariables.json", function(error, st_vars) {
      if (error) {
        throw error;
      }

      // after star variables are readStarVars
      App.starVariables = st_vars;
      readExoplanetData();

    });
  }

  function readExoplanetData() {
    let data = {};

    d3.csv("./data/planets.csv")
      .row((d) => {
        let starName = d["pl_hostname"];

        let planet = {};

        App.planetVariables.forEach(el => {
          planet[el] = d[el];
        });

        if (!data[starName]) {
          // if the star is not already in the list for a planet
          let star = {};

          App.starVariables.forEach(el => {
            star[el] = d[el];
          });

          star.planets = [];

          data[starName] = star;
        }

        // add planet to list
        data[starName].planets.push(planet)
      })
      .get((error, rows) => {
        if (error) {
          throw error;
        }

        App.exoplanetData = data;

        useData();
      });
  }

  // function invoked after all data is laded, draw initial visualizations from this method
  function useData() {
    var loadEndTime = new Date().getTime();
    console.log("Data Load Time:", (loadEndTime - loadStartTime)/1000, "seconds");

    setupDivs();
    drawExpandedPie(App.exoplanetData["BD-06 1339"], "BD-06 1339", App.starPlanet.svg);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 0);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 1);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 2);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 3);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 4);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 5);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 6);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 7);
    drawUnexpandedPie(App.exoplanetData["55 Cnc"], "55 Cnc", App.starPlanet.svg, 8);

		App.updateThumb(0, 0, 1);
		drawStars();

  }

	function setupDivs() {
		let IDs = ["#starOverview", "#starInfo", "#starPlanetPies", "#planetInfo"];
		let padding = 5;

		let width, height;
		let item;

		// set up starOverview panel
		width = d3.select("#starOverview").node().clientWidth;
		height = d3.select("#starOverview").node().clientHeight;

		item = d3.select("#starOverview")
		.append("svg")
			.attr("id", "starOverviewSVG")
			.attr("width", width)
			.attr("height", height);

		App.starOverview = {
			svg: item,
			width: width,
			height: height
		};

		App.starOverview.svg.append("rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.style("fill", "black");

		d3.select("#starOverview")
		.append("div")
			.attr("id", "smallMap");

		// set up starInfo panel
		width = d3.select("#starInfo").node().clientWidth;
		height = d3.select("#starInfo").node().clientHeight;

		item = d3.select("#starInfo")
		.append("svg")
			.attr("id", "starInfoSVG")
			.attr("width", width)
			.attr("height", height);

		App.starInfo = {
			svg: item,
			width: width,
			height: height
		};

		App.starInfo.svg.append("rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.style("fill", "#2b4a7c");

		// set up starPlanet panel
		width = d3.select("#starPlanet").node().clientWidth;
		height = d3.select("#starPlanet").node().clientHeight;

		item = d3.select("#starPlanet")
		.append("svg")
			.attr("id", "starPlanetSVG")
			.attr("width", width)
			.attr("height", height);

		App.starPlanet = {
			svg: item,
			width: width,
			height: height
		};

		App.starPlanet.svg.append("rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.style("fill", "#2b4a7c");

		// set up planetInfo panel
		width = d3.select("#planetInfo").node().clientWidth;
		height = d3.select("#planetInfo").node().clientHeight;

		item = d3.select("#planetInfo")
		.append("svg")
			.attr("id", "planetInfoSVG")
			.attr("width", width)
			.attr("height", height);

		App.planetInfo = {
			svg: item,
			width: width,
			height: height
		};

		App.planetInfo.svg.append("rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.style("fill", "#2b4a7c");

		console.log(App);
	}


})();

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

	panel.svg.append("circle")
		.attr("cx", panel.width / 2)
		.attr("cy", panel.height / 2)
		.attr("r", massScale(1))
		.style("fill", "yellow");

	// inner bound of range
	panel.svg.append("circle")
		.attr("cx", panel.width / 2)
		.attr("cy", panel.height / 2)
		.attr("r", innerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

	// outer bound of range
	panel.svg.append("circle")
		.attr("cx", panel.width / 2)
		.attr("cy", panel.height / 2)
		.attr("r", outerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

	var starIDsSorted = starIDs.slice().sort((a, b) => {
		return +App.exoplanetData[b]["st_dist"] - +App.exoplanetData[a]["st_dist"]
	});

	panel.svg.selectAll(".starPoint")
		.data(starIDs)
	.enter().append("circle")
		.datum((d) => {
			return App.exoplanetData[d];
		})
		.attr("r", (d) => {
			return massScale(+d["st_mass"]);
		})
		.attr("cx", (d, i) => {
			return (panel.width / 2) + (distanceScale(+d["st_dist"] + 0.01) * Math.cos(200 * Math.PI * (i / numStars)));
		})
		.attr("cy", (d, i) => {
			return (panel.height / 2) + (distanceScale(+d["st_dist"] + 0.01) * Math.sin(200 * Math.PI * (i / numStars)));
		})
		.style("fill", "white");

	// create selection arcs

	// inner bound of range
	panel.svg.append("circle")
		.attr("cx", panel.width / 2)
		.attr("cy", panel.height / 2)
		.attr("r", innerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

	// outer bound of range
	panel.svg.append("circle")
		.attr("cx", panel.width / 2)
		.attr("cy", panel.height / 2)
		.attr("r", innerRadius)
		.style("fill", "none")
		.style("stroke", "yellow")
		.style("stroke-opacity", 0.25);

}
