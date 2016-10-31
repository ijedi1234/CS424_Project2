var App = App || {};

(function() {
	App.planetInfo = App.planetInfo || {};

	App.planetInfo.pcp = new Nomogram()
		.target("#planetInfoSVG")
		.margins({
			top: 100,
			bottom: 50,
			left: 100,
			right: 50
		})
		.setAxes([
			{
				name: "pl_hostname",
				label: "Parent Star",
				type: "ordinal"
			},
			{
				name: "pl_orbper",
				label: "Orbital Period",
				type: "linear"
			},
			{
				name: "pl_rade",
				label: "Radius (Earths)",
				type: "linear"
			},
			{
				name: "pl_orbeccen",
				label: "Eccentricity",
				type: "linear"
			},
			{
				name: "pl_orbincl",
				label: "Inclination",
				type: "linear"
			},
			{
				name: "pl_dens",
				label: "Density (g/cm^3)",
				type: "linear"
			},
			{
				name: "pl_disc",
				label: "Year Discovered",
				type: "linear"
			}
		],
		"reduce")
		.brushable(true)
		.opacity(0.75)
		.filteredOpacity(0)
		.color("white")
		.strokeWidth(3)
		.titleFontSize(12)
		.tickFontSize(12);

})();

function drawPlanetCompare(data) {
	App.planetInfo.pcp
		.data(data)
		.draw();
}
