var tabTypes = {
     "types": [
         { "name": "Orbital Period (Earth Days)", "color":"rgb(177,156,217)" },
         { "name": "Minimum Mass (Earth Masses)", "color":"rgb(174,198,207)" },
         { "name": "Discovery Method", "color":"rgb(119,221,119)" }
     ]
};

function drawPie(starInfo, name, target) {
  var vis;

  // add pie and pie svg to target if it exists
  if (target && d3.select(target).node()) {
    vis = d3.select(target);
  } else {
    vis = d3.select("body");
  }

	vis = vis.append("svg").attr("width", "1200").attr("height", "800"); // Added height and width so arc is visible
        var pi = Math.PI;
        var length = starInfo.planets.length;
        var padding = 10;
        var innerRad = 100;
        var outerRad = 240;
        var tabIn = 50;
        var tabOut = 80;
        for (var i = 0; i < length; i++) {
            var arc = d3.arc()
            .innerRadius(innerRad)
            .outerRadius(outerRad)
            .startAngle((i * 360 / length + padding) * (pi / 180)) //converting from degs to radians
            .endAngle(((i + 1) * 360 / length - padding) * (pi / 180)) //just radians

            vis
            .append("path")
            .attr("d", arc)
            .attr("fill", "rgb(253,253,150)")
            .attr("transform", "translate(400, 400)");
        }
        for (var i = 0; i < length; i++) {
            var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(outerRad)
            .startAngle((i * 360 / length - padding) * (pi / 180)) //converting from degs to radians
            .endAngle((i * 360 / length + padding) * (pi / 180)) //just radians

            vis
            .append("path")
            .attr("d", arc)
            .attr("fill", "rgb(255,179,71)")
            .attr("transform", "translate(400, 400)");
        }
        for (var i = 0; i < length; i++) {

	    var angle = ((i + 0.5) * 360 / length) * (pi / 180);
	    angle = ((i + 0.5) * 360 / length) * (pi / 180) - pi/2;

	    //var angleDiff = ((i * 360 / length + padding) * (pi / 180) - ((i + 1) * 360 / length - padding) * (pi / 180)) / 2;
	    var radius = ((outerRad - tabIn) - innerRad) / 2 + innerRad;
	    var transX = 400 + (radius * Math.cos(angle));
	    var transY = 400 + (radius * Math.sin(angle));

            vis
	    .append("text")
	    .attr("transform", "translate(" + transX + "," + transY + ")")
	    .text("" + starInfo.planets[i].pl_letter);
        }
        var center = d3.arc()
        .innerRadius(0)
        .outerRadius(innerRad)
        .startAngle(0) //converting from degs to radians
        .endAngle(2 * pi) //just radians

        vis
        .append("path")
        .attr("d", center)
        .attr("fill", "rgb(255,105,97)")
        .attr("transform", "translate(400, 400)");

        vis
	.append("text")
	.attr("transform", "translate(370,400)")
	.text(name);
        for (var i = 0; i < length; i++) {
            var arcRangeStart = (i * 360 / length + padding) * (pi / 180);
            var arcRangeEnd = ((i + 1) * 360 / length - padding) * (pi / 180);
            var trisectRange = (arcRangeEnd - arcRangeStart) / 3 * (180 / pi);
            var nestPadding = 3;
            for (var j = 0; j < 1; j++) {
                var arc = d3.arc()
                .innerRadius(outerRad - tabIn)
                .outerRadius(outerRad + tabOut)
                .startAngle(arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180)) //converting from degs to radians
                .endAngle(arcRangeStart + ((j + 1) * trisectRange - nestPadding) * (pi / 180)) //just radians

                vis
                .append("path")
                .attr("d", arc)
                .attr("fill", "rgb(177,156,217)")
                .attr("transform", "translate(400, 400)");

		var tabText = starInfo.planets[i].pl_orbper;

		var bisectRange = ((((j + 1) * trisectRange - nestPadding) * (pi / 180)) - ((j * trisectRange + nestPadding) * (pi / 180))) / 2;

		var angle = arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180) - pi/2 + bisectRange;

		var transX1 = (400 + ((outerRad - tabIn) * Math.cos(angle) ) )
		var transY1 = (400 + ((outerRad - tabIn) * Math.sin(angle) ) )
		var transX2 = (400 + ((outerRad + tabOut) * Math.cos(angle) ) )
		var transY2 = (400 + ((outerRad + tabOut) * Math.sin(angle) ) )

		if((angle * (180/pi)) % 360 > 270 || (angle * (180/pi)) % 360 <= 90)
            		vis
	    		.append("text")
	    		.attr("transform", "translate(" + transX1 + "," + transY1 + ") rotate(" + (angle * (180/pi)) + ")")
	    		.text(tabText);
		else
            		vis
	    		.append("text")
	    		.attr("transform", "translate(" + transX2 + "," + transY2 + ") rotate(" + (angle * (180/pi) + 180) + ")")
	    		.text(tabText);
            }
            for (var j = 1; j < 2; j++) {
                var arc = d3.arc()
                .innerRadius(outerRad - tabIn)
                .outerRadius(outerRad + tabOut)
                .startAngle(arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180)) //converting from degs to radians
                .endAngle(arcRangeStart + ((j + 1) * trisectRange - nestPadding) * (pi / 180)) //just radians

                vis
                .append("path")
                .attr("d", arc)
                .attr("fill", "rgb(174,198,207)")
                .attr("transform", "translate(400, 400)");

		var tabText = starInfo.planets[i].pl_msinie;

		var bisectRange = ((((j + 1) * trisectRange - nestPadding) * (pi / 180)) - ((j * trisectRange + nestPadding) * (pi / 180))) / 2;

		var angle = arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180) - pi/2 + bisectRange;

		var transX1 = (400 + ((outerRad - tabIn) * Math.cos(angle) ) )
		var transY1 = (400 + ((outerRad - tabIn) * Math.sin(angle) ) )
		var transX2 = (400 + ((outerRad + tabOut) * Math.cos(angle) ) )
		var transY2 = (400 + ((outerRad + tabOut) * Math.sin(angle) ) )

		if((angle * (180/pi)) % 360 > 270 || (angle * (180/pi)) % 360 <= 90)
            		vis
	    		.append("text")
	    		.attr("transform", "translate(" + transX1 + "," + transY1 + ") rotate(" + (angle * (180/pi)) + ")")
	    		.text(tabText);
		else
            		vis
	    		.append("text")
	    		.attr("transform", "translate(" + transX2 + "," + transY2 + ") rotate(" + (angle * (180/pi) + 180) + ")")
	    		.text(tabText);
            }
            for (var j = 2; j < 3; j++) {
                var arc = d3.arc()
                .innerRadius(outerRad - tabIn)
                .outerRadius(outerRad + tabOut)
                .startAngle(arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180)) //converting from degs to radians
                .endAngle(arcRangeStart + ((j + 1) * trisectRange - nestPadding) * (pi / 180)) //just radians

                vis
                .append("path")
                .attr("d", arc)
                .attr("fill", "rgb(119,221,119)")
                .attr("transform", "translate(400, 400)");

		var tabText = starInfo.planets[i].pl_discmethod;

		var bisectRange = ((((j + 1) * trisectRange - nestPadding) * (pi / 180)) - ((j * trisectRange + nestPadding) * (pi / 180))) / 2;

		var angle = arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180) - pi/2 + bisectRange;

		var transX1 = (400 + ((outerRad - tabIn) * Math.cos(angle) ) )
		var transY1 = (400 + ((outerRad - tabIn) * Math.sin(angle) ) )
		var transX2 = (400 + ((outerRad + tabOut) * Math.cos(angle) ) )
		var transY2 = (400 + ((outerRad + tabOut) * Math.sin(angle) ) )

		if((angle * (180/pi)) % 360 > 270 || (angle * (180/pi)) % 360 <= 90)
            		vis
	    		.append("text")
	    		.attr("transform", "translate(" + transX1 + "," + transY1 + ") rotate(" + (angle * (180/pi)) + ")")
	    		.text(tabText);
		else
            		vis
	    		.append("text")
	    		.attr("transform", "translate(" + transX2 + "," + transY2 + ") rotate(" + (angle * (180/pi) + 180) + ")")
	    		.text(tabText);
            }
        }
        tabTypes.types.forEach(function(d, i) {
	    drawLegend(d,i,vis);
	});
}

function drawLegend(d, i, svg) {
    var xOff = 700; var yOff = 100;
    svg.append('rect').attr("x",xOff).attr("y",yOff + i * 30).attr("width",20).attr("height",15).style("fill",d.color);
    svg.append('text').attr("x",xOff + 30).attr("y",yOff + i * 30 + 15)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .text(d.name);
}
