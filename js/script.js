/**
	1 - Protein
	2 - Total lipid (fat)
	3 - Carbohydrate, by difference
	20 - Fiber, total dietary
	26 - Sodium, Na
	89 - Cholesterol
**/
var dvValues = {
	"1":50,
	"2":65,
	"3":300,
	"20":25,
	"26":2400,
	"89":300
}

var foodData = [];


function createChart(idContainer){
	dataChart = [];

	
	for(var i = 0; i<foodData.length;i++){
		dataChart.push(foodDataToRadioChart(foodData[i].report.food));
		loadFoodInfo(foodData[i].report.food, i+1);
	}

	var container = $("#"+idContainer),
	width = container.width();
	height = 350;

	var chart = RadarChart.chart();
    var cfg = chart.config(); // retrieve default config

    chart.config({maxValue: 50, w: 350, h:320});

    
    var svg = d3.select('#results').append('svg')
      .attr('width', "100%")
      .attr('height', "100%")
      .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
      .attr('preserveAspectRatio','xMinYMin');
    svg.append('g').classed('single', 1).datum(dataChart).call(chart);
}

function foodDataToRadioChart(dataFood){
	chartData = new Object();
	chartData.className = dataFood.name;
	chartData.axes = new Array();

	nutrients = dataFood.nutrients;

	//var protein, totalFat, carbo, cho, sodium, fiber;
	var k=0;

	for(var i = 0; i<nutrients.length;i++){
		if(k==6)
			break;

		switch(nutrients[i].id){
			case 1:
			case 2:
			case 3:
			case 20:
			case 26:
			case 89:
				chartData.axes.push({axis: nutrients[i].name, value: ((nutrients[i].measures[0].value/dvValues[""+nutrients[i].id])*100).toFixed(2)});
				k++;		
			default:
				break;

		}
	}

	return chartData;
}

function pushFoodData(food){
	foodData.push(food);
}

function cleanFoodData(){
	foodData = new Array();
	$("#results").empty();
	$("#panelFoodInfo").empty();
}

function loadFoodInfo(food, n){
	$("<div/>", {
		"class": "food-info",
		html: "<h5>Food "+n+"</h5><label class=\"lbl-infofood\">Name:</label>"+food.name+
			  "<br /><label class=\"lbl-infofood\">Serving size:</label> "+food.nutrients[0].measures[0].qty+" "+food.nutrients[0].measures[0].label+" ("+food.nutrients[0].measures[0].eqv+"g)"
	}).hide().appendTo("#panelFoodInfo");
}