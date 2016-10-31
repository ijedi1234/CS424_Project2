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
			.style("top", ((y * heightRatio) - (smallBoxHeight/2)) + "px")
			.style("left", ((x * widthRatio) - (smallBoxWidth/2)) + "px")
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
    //drawPie(App.exoplanetData["BD-06 1339"], "BD-06 1339", App.starPlanet.svg);

		App.updateThumb(App.starOverview.width / 2, App.starOverview.height / 2, 1);
		drawStars();

    drawStarComparison();

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
var selectCount = 0;

//keeps track of stars already clicked
var starComparisonArr = ["Empty"];
//keeps track of the data of the stars
var starComparisonData = [0];
//colors of the scatterplot
var scatterColors = ["#E6842A", "#8E6C8A", "#5C8100", "#684664"];
//value of the toggling-> 0 = distance, 1 = mass, 2 = radius
var toggleValue = 0;


function drawStarComparison(){
  var panel = App.starInfo;

  const scatterMargin = {
          top: 40,
          right: 20,
          bottom: 50,
          left: 80
      },
      scatterWidth = panel.width - scatterMargin.left - scatterMargin.right,
      scatterHeight = panel.height - scatterMargin.top - scatterMargin.bottom;

  panel.svg.attr('width', scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr('height', scatterHeight + scatterMargin.top + scatterMargin.bottom)
    .append('g')
    .attr('transform', "translate(" + scatterMargin.left + "," + scatterMargin.top + ")")
  //panel.svg.attr('transform', "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");

  console.log(App.starInfo);

  //var starComparisonArr = ["Empty"];

  var xScale0 = d3.scaleBand()
              .domain(starComparisonArr)
              .rangeRound([0, scatterWidth]);

  var yScale0 = d3.scaleLinear()
              .domain([0,50])
              .range([scatterHeight, 0]);

  var trueHeight = scatterHeight + scatterMargin.top;
  panel.svg.append("g")
      .style("font-size","16px")
      .style("font-family", "sans-serif")
      .attr("class", "axis axis--x")
      .attr("id", "xaxis")
      .attr("transform", "translate(" + scatterMargin.left + "," + trueHeight + ")")
      //.attr("transform", "translate(0," + scatterHeight + ")")
      .call(d3.axisBottom(xScale0));


  panel.svg.append("g")
      .style("font-size","16px")
      .style("font-family", "sans-serif")
      .attr("class", "axis axis--y")
      .attr("id", "yaxis")
      .attr("transform", "translate(" +  scatterMargin.left + "," + scatterMargin.top + " )")
      .call(d3.axisLeft(yScale0).ticks(10, 's'));

  /*panel.svg.append("g")
    .data(starComparisonData)
    .enter().append("circle")
    .attr("id", "scatterCircles")
    .attr("cx", function(d,i){ console.log(i); return starComparisonArr[i];})
    .attr("cy", d => yScale0(d))
    .attr("r", 10)
    .style("fill", scatterColors[0]);*/

  panel.svg.append("text")
    .attr("id", "xlabel")
    .attr("text-anchor", "end")
    .attr("x", scatterWidth/2 + 100)
    .attr("y", trueHeight + 45)
    .text("Stars")
    .style("font-size", "20px")
    .style("font-family", "sans-serif");


  panel.svg.append("text")
    .attr("id", "ylabel")
    .attr("text-anchor", "end")
    .attr("x", -trueHeight/2 + 20)
    .attr("y", 30)
    .attr("transform", "rotate(-90)")
    .text("Parsecs")
    .style("font-size", "20px")
    .style("font-family", "sans-serif");

  panel.svg.append("text")
      .attr("x", (scatterWidth / 2) + 50)
      .attr("y", 0 - (scatterMargin.top / 2)  + 50)
      .attr("text-anchor", "middle")
      .attr("id", "scatterTitle")
      .style("font-size", "30px")
      .style("font-family", "sans-serif")
      .style("text-decoration", "underline")
      .style("fill", scatterColors[0])
      .text("Star Distance");

  panel.svg.append("rect")
      .attr("width", 80)
      .attr("height", 25)
      .attr("x", 20)
      .attr("id", "scatterToggle")
      .style("fill", scatterColors[0]);

  panel.svg.append("text")
      .attr("x", 30)
      .attr("y", 20)
      .attr("id", "scatterToggleText")
      .style("font-size", "18px")
      .style("font-family", "sans-serif")
      .text("Toggle");

  panel.svg.selectAll("#scatterToggle")
      .on("click", function(d,i){
        toggleValue++;
        updateStarComparison(null,null);
      });

  panel.svg.selectAll("#scatterToggleText")
      .on("click", function(d,i){
        toggleValue++;
        updateStarComparison(null,null);
      });
}

function updateStarComparison(starName, starData){
  var panel = App.starInfo;

  const scatterMargin = {
          top: 40,
          right: 20,
          bottom: 50,
          left: 80
      },
      scatterWidth = panel.width - scatterMargin.left - scatterMargin.right,
      scatterHeight = panel.height - scatterMargin.top - scatterMargin.bottom;

  if(starComparisonArr.includes(starName))
    return;

  console.log("star name " + starName + " star data " + starData);

  if(starName != null && starData != null){
      if(starComparisonArr[0] == "Empty"){
        starComparisonArr[0] = starName;
        starComparisonData[0] = starData;
      }
      else {
        starComparisonArr.push(starName);
        starComparisonData.push(starData);
      }
  }

  console.log("HELLO123");

  var data = [];

  //st_dist
  if(toggleValue == 0 || toggleValue == 3/*4*/){
    if(toggleValue == 3)
      toggleValue = 0;
    panel.svg.select("#scatterTitle")
        .transition()
        .duration(750)
        .text("Star Distance")
        .style("fill", scatterColors[toggleValue]);

    panel.svg.select("#ylabel")
        .transition()
        .duration(750)
        .text("Parsecs");
    //if no entry is found, just set it to 0
    starComparisonData.forEach(function(d) {
      if(!isNaN(parseInt(d["st_dist"])))
          data.push(parseInt(d["st_dist"]))
      else
          data.push(0)}
    );
    console.log(data);
  }
  //st_mass
  else if(toggleValue == 1){
    panel.svg.select("#scatterTitle")
        .transition()
        .duration(750)
        .text("Star Mass")
        .style("fill", scatterColors[toggleValue]);

    panel.svg.select("#ylabel")
        .transition()
        .duration(750)
        .text("Solar Mass");
    starComparisonData.forEach(function(d) {
      if(!isNaN(parseInt(d["st_mass"])))
          data.push(parseInt(d["st_mass"]))
      else
          data.push(0)}
    );
    console.log(data);
  }
  //st_rad
  else if(toggleValue == 2){
    panel.svg.select("#scatterTitle")
        .transition()
        .duration(750)
        .text("Star Radius")
        .style("fill", scatterColors[toggleValue]);
    panel.svg.select("#ylabel")
        .transition()
        .duration(750)
        .text("Solar Radii");
    starComparisonData.forEach(function(d) {
      if(!isNaN(parseInt(d["st_rad"])))
          data.push(parseInt(d["st_rad"]))
      else
          data.push(0)}
    );
    console.log(data);
  }
  //st_spstr (to be added later)
  //else if(toggleValue == 3){
    /*starComparisonData.forEach(d => data.push(d["st_spstr"]));
    console.log(data);*/
  //}
  /*Uncomment when st_spstr completed
  else if(toggleValue == 4){
    toggleValue = 0;
  }*/
  var trueHeight = scatterHeight + scatterMargin.top;

  var xScale0 = d3.scaleBand()
              .domain(starComparisonArr)
              .rangeRound([0, scatterWidth]);
  //xScale0.domain(starComparisonArr);
  var yScale0;
  if(data.length > 1)
    yScale0 = d3.scaleLinear()
                .domain([d3.min(data, d => d) * 0.8, d3.max(data, d => d) * 1.2])
                .range([scatterHeight, 0]);
  else {
    yScale0 = d3.scaleLinear()
                .domain([0, d3.max(data, d => d) * 1.2])
                .range([scatterHeight, 0]);
  }

  var xStartValue = scatterWidth - (xScale0(starComparisonArr[starComparisonArr.length - 1]) + (scatterWidth/2) / starComparisonArr.length);
  var xCorruptedWidth = scatterWidth - 2 * xStartValue;

  //change toggle button color
  panel.svg.selectAll("#scatterToggle")
      .transition()
      .duration(750)
      .style("fill", scatterColors[toggleValue]);

  //update current scatterplot circles
  panel.svg.selectAll("#scatterCircles")
      .data(data)
      .attr("class", "update")
      .transition()
      .duration(750)
      .attr("cx", function(d,i){
          var xOffsetObject = 0;
          if(starComparisonArr.length > 1)
              xOffsetObject = i * xCorruptedWidth / (starComparisonArr.length - 1);
          var value = xStartValue + xOffsetObject;
          return value;
      })
      .attr("cy", d => yScale0(d)+ scatterMargin.top)
      //.attr("transform", "translate(" + scatterMargin.left + ", 0)")
      .attr("r", 10)
      .style("fill", scatterColors[toggleValue]);


//add new scatterplot circle with a new g
//HERE LOUIS
  panel.svg.selectAll("#circleG")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d){return "translate("+scatterMargin.left+",0)"})
    .attr("id", "circleG")
    .append("circle")
    .attr("id", "scatterCircles")
    .transition()
    .duration(750)
    .attr("cx", function(d,i){
        var xOffsetObject = 0;
        if(starComparisonArr.length > 1)
            xOffsetObject = i * xCorruptedWidth / (starComparisonArr.length - 1);
        var value = xStartValue + xOffsetObject;
        return value;
    })
    //.attr("transform", "translate(" + scatterMargin.left + ", 0)")
    .attr("cy", d => yScale0(d) + scatterMargin.top)
    .attr("r", 10)
    .style("fill", scatterColors[toggleValue]);

//mouseover to see values on scatterplot
  panel.svg.selectAll("#circleG")
      .on("mouseover", function(d,i){
          var numobjectHovered = i;
        console.log(d + i);
        d3.select(this).append("text")
            .attr("id", "totalsText")
            .attr("dy", yScale0(d) + 20)
            .attr("dx",  function(){
                var xOffsetObject = 0;
                if(starComparisonArr.length > 1)
                    xOffsetObject = numobjectHovered * xCorruptedWidth / (starComparisonArr.length - 1);
                var value = xStartValue + xOffsetObject;
                return value-15;
            })
            .style("fill", scatterColors[toggleValue])
            .style("font-size", "18px")
            .style("font-family", "sans-serif")
            .text(d);
      })
      .on("mouseleave", function(d,i){
        d3.select(this).selectAll("text").remove();
      });

  panel.svg.select("#xaxis")
      .transition()
      .duration(750)
      .call(d3.axisBottom(xScale0));

  panel.svg.select("#yaxis")
      .transition()
      .duration(750)
      .call(d3.axisLeft(yScale0).ticks(10, 's'));

}

function removeCircle(starName){
  var panel = App.starInfo;

  const scatterMargin = {
          top: 40,
          right: 20,
          bottom: 50,
          left: 80
      },
      scatterWidth = panel.width - scatterMargin.left - scatterMargin.right,
      scatterHeight = panel.height - scatterMargin.top - scatterMargin.bottom;

  var index = starComparisonArr.indexOf(starName);

  starComparisonArr.splice(index, 1);
  starComparisonData.splice(index, 1);

  var data = [];

  if(toggleValue == 0 || toggleValue == 3/*4*/){
    if(toggleValue == 3)
      toggleValue = 0;
    panel.svg.select("#scatterTitle")
        .transition()
        .duration(750)
        .text("Star Distance")
        .style("fill", scatterColors[toggleValue]);

    panel.svg.select("#ylabel")
        .transition()
        .duration(750)
        .text("Parsecs");
    //if no entry is found, just set it to 0
    starComparisonData.forEach(function(d) {
      if(!isNaN(parseInt(d["st_dist"])))
          data.push(parseInt(d["st_dist"]))
      else
          data.push(0)}
    );
    console.log(data);
  }
  //st_mass
  else if(toggleValue == 1){
    panel.svg.select("#scatterTitle")
        .transition()
        .duration(750)
        .text("Star Mass")
        .style("fill", scatterColors[toggleValue]);

    panel.svg.select("#ylabel")
        .transition()
        .duration(750)
        .text("Solar Mass");
    starComparisonData.forEach(function(d) {
      if(!isNaN(parseInt(d["st_mass"])))
          data.push(parseInt(d["st_mass"]))
      else
          data.push(0)}
    );
    console.log(data);
  }
  //st_rad
  else if(toggleValue == 2){
    panel.svg.select("#scatterTitle")
        .transition()
        .duration(750)
        .text("Star Radius")
        .style("fill", scatterColors[toggleValue]);
    panel.svg.select("#ylabel")
        .transition()
        .duration(750)
        .text("Solar Radii");
    starComparisonData.forEach(function(d) {
      if(!isNaN(parseInt(d["st_rad"])))
          data.push(parseInt(d["st_rad"]))
      else
          data.push(0)}
    );
    console.log(data);
  }

  var xScale0 = d3.scaleBand()
              .domain(starComparisonArr)
              .rangeRound([0, scatterWidth]);
  //xScale0.domain(starComparisonArr);
  var yScale0;
  if(data.length > 1)
    yScale0 = d3.scaleLinear()
                .domain([d3.min(data, d => d) * 0.8, d3.max(data, d => d) * 1.2])
                .range([scatterHeight, 0]);
  else {
    yScale0 = d3.scaleLinear()
                .domain([0, d3.max(data, d => d) * 1.2])
                .range([scatterHeight, 0]);
  }

  var xStartValue = scatterWidth - (xScale0(starComparisonArr[starComparisonArr.length - 1]) + (scatterWidth/2) / starComparisonArr.length);
  var xCorruptedWidth = scatterWidth - 2 * xStartValue;

  panel.svg.select("#xaxis")
      .transition()
      .duration(750)
      .call(d3.axisBottom(xScale0));

  panel.svg.select("#yaxis")
      .transition()
      .duration(750)
      .call(d3.axisLeft(yScale0).ticks(10, 's'));

  panel.svg.selectAll("#circleG")
      .data(data)
      .exit()
      .remove();

  panel.svg.selectAll("#scatterCircles")
      .attr("class", "update")
      .transition()
      .duration(750)
      .attr("cx", function(d,i){
          var xOffsetObject = 0;
          if(starComparisonArr.length > 1)
              xOffsetObject = i * xCorruptedWidth / (starComparisonArr.length - 1);
          var value = xStartValue + xOffsetObject;
          return value;
      })
      .attr("cy", d => yScale0(d)+ scatterMargin.top)
      //.attr("transform", "translate(" + scatterMargin.left + ", 0)")
      .attr("r", 10)
      .style("fill", scatterColors[toggleValue]);

  updateStarComparison(null,null);
  selectCount--;
  /*panel.svg.selectAll("#circleG")
      .on("mouseover", function(d,i){
          var numobjectHovered = i;
        console.log(d + i);
        d3.select(this).append("text")
            .attr("id", "totalsText")
            .attr("dy", yScale0(d) + 20)
            .attr("dx",  function(){
                var xOffsetObject = 0;
                if(starComparisonArr.length > 1)
                    xOffsetObject = numobjectHovered * xCorruptedWidth / (starComparisonArr.length - 1);
                var value = xStartValue + xOffsetObject;
                return value-15;
            })
            .style("fill", scatterColors[toggleValue])
            .style("font-size", "18px")
            .style("font-family", "sans-serif")
            .text(d);
      })
      .on("mouseleave", function(d,i){
        d3.select(this).selectAll("text").remove();
      });
*/
}
