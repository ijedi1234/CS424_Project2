var tabTypes = {
    "types": [
        { "name": "Orbital Period (Earth Days)", "color": "rgb(177,156,217)" },
        { "name": "Minimum Mass (Earth Masses)", "color": "rgb(174,198,207)" },
        { "name": "Discovery Year", "color": "rgb(119,221,119)" }
    ]
};

function drawUnexpandedPie(starInfo, name, target, position) {
    var vis;

    // add pie to target if it exists
    if (target) {
        vis = target;
    } else {
        vis = d3.select("body").append("svg").attr("width", 1200).attr("height", 800);
    }

    var width = vis.node().clientWidth,
        height = vis.node().clientHeight;

    var pi = Math.PI;
    var length = starInfo.planets.length;
    var padding = 10;
    var outerRad = (d3.min([width, height]) / 2) - 120;
    var innerRad = outerRad / 2 - 20;
    var tabIn = ((d3.min([width, height]) / 2) - outerRad) / 2 - 30;
    var tabOut = ((d3.min([width, height]) / 2) - outerRad) / 2 - 20;

    var expandedPieCenter = {
        x: (d3.min([width, height]) / 2),
        y: (d3.min([width, height]) / 2)
    };

    //var startingPoint = d3.min([width, height]) / 2 - (outerRad + tabOut) + innerRad;
    var startingPoint = d3.min([width, height]) / 2 - (outerRad + tabOut);
    var accountForUnexpanded = (2 * innerRad + 5) * position;

    var unexpandedPieCenter = {
        //x: (startingPoint + accountForExpanded + accountForUnexpanded - 30),
        x: (startingPoint + accountForUnexpanded - 30),
        y: (d3.min([width, height]) / 2 + (outerRad + tabOut - innerRad) + 30)
    };

    var center = d3.arc()
    .innerRadius(0)
    .outerRadius(innerRad)
    .startAngle(0) //converting from degs to radians
    .endAngle(2 * pi) //just radians

    vis
    .append("path")
    .attr("d", center).attr("data-star", name).attr("id", "pieStarUnselected").attr("onclick", "selectPieStar(this)")
    .attr("fill", "rgb(255,105,97)")
            .attr("transform", "translate(" + (unexpandedPieCenter.x) + ", " + (unexpandedPieCenter.y) + ")");

    var cutName = name.substring(0, 10);

    vis
.append("text").attr("data-star", name).attr("id", "pieStarUnselected").attr("onclick", "selectPieStar(this)")
.attr("transform", "translate(" + (unexpandedPieCenter.x) + ", " + (5 + unexpandedPieCenter.y) + ")")
.style("text-anchor", "middle")
.text(cutName);
}

function drawExpandedPie(starInfo, name, target) {
    var vis;

    // add pie to target if it exists
    if (target) {
        vis = target;
    } else {
        vis = d3.select("body").append("svg").attr("width", 1200).attr("height", 800);
    }

    var width = vis.node().clientWidth,
        height = vis.node().clientHeight;

    var pi = Math.PI;
    var length = starInfo.planets.length;
    var padding = 10;
    var outerRad = (d3.min([width, height]) / 2) - 120;
    var innerRad = outerRad / 2 - 20;
    var tabIn = ((d3.min([width, height]) / 2) - outerRad) / 2 - 30;
    var tabOut = ((d3.min([width, height]) / 2) - outerRad) / 2 - 20;

    //var startingPoint = d3.min([width, height]) / 2 - (outerRad + tabOut) + innerRad;
    var startingPoint = d3.min([width, height]) / 2 - (outerRad + tabOut);

    var pieCenter = {
        //x: (startingPoint + (outerRad + tabOut) - innerRad + accountForUnexpanded - 30),
        x: (startingPoint + (outerRad + tabOut)),
        y: (d3.min([width, height]) / 2 - 60)
        // x: (d3.min([width, height]) / 2 + (outerRad + tabOut)),
        //  y: (d3.min([width, height]) / 2 + (outerRad + tabOut - innerRad))
    };
    for (var i = 0; i < length; i++) {
        var arc = d3.arc()
        .innerRadius(innerRad)
        .outerRadius(outerRad)
        .startAngle((i * 360 / length + padding) * (pi / 180)) //converting from degs to radians
        .endAngle(((i + 1) * 360 / length - padding) * (pi / 180)) //just radians

        vis
        .append("path")
        .attr("d", arc)
        .attr("fill", "rgb(253,253,150)").attr("data-star", name).attr("id", "pieStarSelected")
                    .attr("transform", "translate(" + (pieCenter.x) + ", " + (pieCenter.y) + ")");
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
        .attr("fill", "rgb(255,179,71)").attr("data-star", name).attr("id", "pieStarSelected")
                    .attr("transform", "translate(" + (pieCenter.x) + ", " + (pieCenter.y) + ")");
    }
    for (var i = 0; i < length; i++) {

        var angle = ((i + 0.5) * 360 / length) * (pi / 180);
        angle = ((i + 0.5) * 360 / length) * (pi / 180) - pi / 2;

        //var angleDiff = ((i * 360 / length + padding) * (pi / 180) - ((i + 1) * 360 / length - padding) * (pi / 180)) / 2;
        var radius = ((outerRad - tabIn) - innerRad) / 2 + innerRad;
        var transX = pieCenter.x + (radius * Math.cos(angle));
        var transY = pieCenter.y + (radius * Math.sin(angle));

        vis
    .append("text").attr("data-star", name).attr("id", "pieStarSelected")
    .attr("transform", "translate(" + transX + "," + transY + ")")
    .text("" + starInfo.planets[i].pl_letter);
    }
    var center = d3.arc()
    .innerRadius(0)
    .outerRadius(innerRad)
    .startAngle(0) //converting from degs to radians
    .endAngle(2 * pi) //just radians

    vis
    .append("path").attr("data-star", name).attr("id", "pieStarSelected")
    .attr("d", center)
    .attr("fill", "rgb(255,105,97)")
            .attr("transform", "translate(" + (pieCenter.x) + ", " + (pieCenter.y) + ")");

    var cutName = name.substring(0, 10);

    vis
.append("text").attr("data-star", name).attr("id", "pieStarSelected")
.attr("transform", "translate(" + (pieCenter.x) + ", " + (5 + pieCenter.y) + ")")
.style("text-anchor", "middle")
.text(cutName);

    var maxOrbPer = -1.0;
    for (var i = 0; i < length; i++) {
        var period = parseFloat(starInfo.planets[i].pl_orbper);
        if (period != NaN && maxOrbPer < period) maxOrbPer = period;
    }

    var minOrbPer = 1000000.0;
    for (var i = 0; i < length; i++) {
        var period = parseFloat(starInfo.planets[i].pl_orbper);
        if (period != NaN && minOrbPer > period) minOrbPer = period;
    }

    var maxYear = -1.0;
    for (var i = 0; i < length; i++) {
        var year = parseFloat(starInfo.planets[i].pl_disc);
        if (year != NaN && maxYear < year) maxYear = year;
    }

    var minYear = 1000000.0;
    for (var i = 0; i < length; i++) {
        var year = parseFloat(starInfo.planets[i].pl_disc);
        if (year != NaN && minYear > year) minYear = year;
    }

    var maxMass = -1.0;
    for (var i = 0; i < length; i++) {
        var mass = parseFloat(starInfo.planets[i].pl_bmasse);
        if (mass != NaN && maxMass < mass) maxMass = mass;
    }

    var minMass = 1000000.0;
    for (var i = 0; i < length; i++) {
        var mass = parseFloat(starInfo.planets[i].pl_bmasse);
        if (mass != NaN && minMass > mass) minMass = mass;
    }

    if (maxOrbPer != -1)
        var orbitScale = d3.scaleLog().domain([minOrbPer, maxOrbPer]).range([0, tabOut]);
    if (maxYear != -1)
        var yearScale = d3.scaleLog().domain([minYear, maxYear]).range([0, tabOut]);
    if (maxMass != -1)
        var massScale = d3.scaleLog().domain([minMass, maxMass]).range([0, tabOut]);

    for (var i = 0; i < length; i++) {
        var arcRangeStart = (i * 360 / length + padding) * (pi / 180);
        var arcRangeEnd = ((i + 1) * 360 / length - padding) * (pi / 180);
        var trisectRange = (arcRangeEnd - arcRangeStart) / 3 * (180 / pi);
        var nestPadding = 3;
        for (var j = 0; j < 1; j++) {
            var scaledOuterRadius = tabOut;
            if (maxOrbPer != -1) scaledOuterRadius = orbitScale(starInfo.planets[i].pl_orbper);
            var arc = d3.arc()
            .innerRadius(outerRad - tabIn)
            .outerRadius(outerRad + scaledOuterRadius)
            .startAngle(arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180)) //converting from degs to radians
            .endAngle(arcRangeStart + ((j + 1) * trisectRange - nestPadding) * (pi / 180)) //just radians

            vis
            .append("path").attr("data-star", name)
            .attr("d", arc).attr("id", "pieStarSelected")
            .attr("fill", "rgb(177,156,217)")
                            .attr("transform", "translate(" + (pieCenter.x) + ", " + (pieCenter.y) + ")");

            var tabText = starInfo.planets[i].pl_orbper;

            var bisectRange = ((((j + 1) * trisectRange - nestPadding) * (pi / 180)) - ((j * trisectRange + nestPadding) * (pi / 180))) / 2;

            var angle = arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180) - pi / 2 + bisectRange;

            var transX1 = (pieCenter.x + ((outerRad - tabIn) * Math.cos(angle)))
            var transY1 = (pieCenter.y + ((outerRad - tabIn) * Math.sin(angle)))
            var transX2 = (pieCenter.x + ((outerRad + tabOut) * Math.cos(angle)))
            var transY2 = (pieCenter.y + ((outerRad + tabOut) * Math.sin(angle)))

            if ((angle * (180 / pi)) % 360 > 270 || (angle * (180 / pi)) % 360 <= 90)
                vis
            .append("text").attr("data-star", name).attr("id", "pieStarSelected")
            .attr("transform", "translate(" + transX1 + "," + transY1 + ") rotate(" + (angle * (180 / pi)) + ")")
            .text(tabText);
            else
                vis
            .append("text").attr("data-star", name).attr("id", "pieStarSelected")
            .attr("transform", "translate(" + transX2 + "," + transY2 + ") rotate(" + (angle * (180 / pi) + 180) + ")")
            .text(tabText);
        }
        for (var j = 1; j < 2; j++) {
            var scaledOuterRadius = tabOut;
            if (maxOrbPer != -1) scaledOuterRadius = massScale(starInfo.planets[i].pl_bmasse);
            var arc = d3.arc()
            .innerRadius(outerRad - tabIn)
            .outerRadius(outerRad + scaledOuterRadius)
            .startAngle(arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180)) //converting from degs to radians
            .endAngle(arcRangeStart + ((j + 1) * trisectRange - nestPadding) * (pi / 180)) //just radians

            vis
            .append("path").attr("data-star", name)
            .attr("d", arc).attr("id", "pieStarSelected")
            .attr("fill", "rgb(174,198,207)")
                            .attr("transform", "translate(" + (pieCenter.x) + ", " + (pieCenter.y) + ")");

            var tabText = starInfo.planets[i].pl_bmasse;

            var bisectRange = ((((j + 1) * trisectRange - nestPadding) * (pi / 180)) - ((j * trisectRange + nestPadding) * (pi / 180))) / 2;

            var angle = arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180) - pi / 2 + bisectRange;

            var transX1 = (pieCenter.x + ((outerRad - tabIn) * Math.cos(angle)))
            var transY1 = (pieCenter.y + ((outerRad - tabIn) * Math.sin(angle)))
            var transX2 = (pieCenter.x + ((outerRad + tabOut) * Math.cos(angle)))
            var transY2 = (pieCenter.y + ((outerRad + tabOut) * Math.sin(angle)))

            if ((angle * (180 / pi)) % 360 > 270 || (angle * (180 / pi)) % 360 <= 90)
                vis
            .append("text").attr("data-star", name).attr("id", "pieStarSelected")
            .attr("transform", "translate(" + transX1 + "," + transY1 + ") rotate(" + (angle * (180 / pi)) + ")")
            .text(tabText);
            else
                vis
            .append("text").attr("data-star", name).attr("id", "pieStarSelected")
            .attr("transform", "translate(" + transX2 + "," + transY2 + ") rotate(" + (angle * (180 / pi) + 180) + ")")
            .text(tabText);
        }
        for (var j = 2; j < 3; j++) {
            var scaledOuterRadius = tabOut;
            if (maxOrbPer != -1) scaledOuterRadius = yearScale(starInfo.planets[i].pl_disc);
            var arc = d3.arc()
            .innerRadius(outerRad - tabIn)
            .outerRadius(outerRad + scaledOuterRadius)
            .startAngle(arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180)) //converting from degs to radians
            .endAngle(arcRangeStart + ((j + 1) * trisectRange - nestPadding) * (pi / 180)) //just radians

            vis
            .append("path").attr("data-star", name)
            .attr("d", arc).attr("id", "pieStarSelected")
            .attr("fill", "rgb(119,221,119)")
                            .attr("transform", "translate(" + (pieCenter.x) + ", " + (pieCenter.y) + ")");

            var tabText = starInfo.planets[i].pl_disc;

            var bisectRange = ((((j + 1) * trisectRange - nestPadding) * (pi / 180)) - ((j * trisectRange + nestPadding) * (pi / 180))) / 2;

            var angle = arcRangeStart + (j * trisectRange + nestPadding) * (pi / 180) - pi / 2 + bisectRange;

            var transX1 = (pieCenter.x + ((outerRad - tabIn) * Math.cos(angle)))
            var transY1 = (pieCenter.y + ((outerRad - tabIn) * Math.sin(angle)))
            var transX2 = (pieCenter.x + ((outerRad + tabOut) * Math.cos(angle)))
            var transY2 = (pieCenter.y + ((outerRad + tabOut) * Math.sin(angle)))

            if ((angle * (180 / pi)) % 360 > 270 || (angle * (180 / pi)) % 360 <= 90)
                vis
            .append("text").attr("data-star", name).attr("id", "pieStarSelected")
            .attr("transform", "translate(" + transX1 + "," + transY1 + ") rotate(" + (angle * (180 / pi)) + ")")
            .text(tabText);
            else
                vis
            .append("text").attr("data-star", name).attr("id", "pieStarSelected")
            .attr("transform", "translate(" + transX2 + "," + transY2 + ") rotate(" + (angle * (180 / pi) + 180) + ")")
            .text(tabText);
        }
    }
    tabTypes.types.forEach(function (d, i) {
        drawLegend(d, i, vis);
    });
}

function drawLegend(d, i, svg) {
    var xOff = svg.node().clientWidth - 200;
    var yOff = 10;
    svg.append('rect').attr("x", xOff).attr("y", yOff + i * 30).attr("width", 20).attr("height", 15).style("fill", d.color);
    svg.append('text').attr("x", xOff + 30).attr("y", yOff + i * 30 + 12)
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .text(d.name).attr("fill", "yellow");
}

function deletePieSelected() {
    App.starPlanet.svg.selectAll("#pieStarSelected").remove();
}

function selectPieStar(element) {
    var name = element.getAttribute("data-star");
    //alert(name);
    var info = App.exoplanetData[name];
    deletePieSelected();
    drawExpandedPie(info, name, App.starPlanet.svg);
}
