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
    drawPie(App.exoplanetData["BD-06 1339"], "BD-06 1339", App.starPlanet.svg);


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
			.style("fill", "#2b4a7c");

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
