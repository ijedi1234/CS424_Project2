
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


  }
})();
