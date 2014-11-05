/**
	1 - Protein
	2 - Total lipid (fat)
	3 - Carbohydrate, by difference
	20 - Fiber, total dietary
	26 - Sodium, Na
	89 - Cholesterol

	Nutrients not found: Biotin, Panthotenic acid, Iodine, Selenium, Copper, Manganese
**/
var dvValues = {
	"1":50,
	"2":65,
	"3":300,
	"20":25,
	"25":3500,
	"26":2400,
	"89":300,
	"32":5000,
	"52":60,
	"21":1000,
	"22":18,
	"38":400,
	"37":15, //source: http://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/
	"63":80,
	"53":1.5,
	"54":1.7,
	"55":20,
	"57":2,
	"66":400,
	"59":6,
	"24":1000,
	"23": 400,
	"27":15
}

var foodData = [];

var radarChartData;
var bubbleChartData;

function createChart(idContainer){
	radarChartData = [];
	bubbleChartData = [];

	LegendOptions = ["Food 1", "Food 2"];

	var colorscale = d3.scale.category10();

	for(var i = 0; i<foodData.length;i++){
		foodDataToCharts(foodData[i].report.food, i+1);
		loadFoodInfo(foodData[i].report.food, i+1);
	}

	var container = $("#"+idContainer),
	width = container.width();
	height = 350;

	/*var chart = RadarChart.chart();
    var cfg = chart.config(); // retrieve default config

    chart.config({maxValue: 50, w: 350, h:320});

    
    var svg = d3.select('#results').append('svg')
      .attr('width', "100%")
      .attr('height', "100%")
      .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
      .attr('preserveAspectRatio','xMinYMin');
    svg.append('g').classed('single', 1).datum(dataChart).call(chart);*/
    var w = 300, h= 250;

    var mycfg = {
    	w: w,
    	h: h,
    	maxValue: 0.8,
    	levels: 5,
    	ExtraWidthX: 180
    };

    RadarChart.draw("#"+idContainer, radarChartData, mycfg);

    //Legend
    var svg = d3.select('#radarPanel')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+180)
		.attr("height", h);

	var text = svg.append("text")
				.attr("class", "title")
				.attr('transform', 'translate(90,0)') 
				.attr("x", w - 100)
				.attr("y", 10)
				.attr("font-size", "12px")
				.attr("fill", "#404040")
				.text("%DV of each food");

	//Initiate Legend	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)');
		//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 95)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);});
	
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 82)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; });

	  // instantiate d3plus
	  var visualization = d3plus.viz()
	    .container("#bubbleChartContainer")     // container DIV to hold the visualization
	    .data(bubbleChartData)     // data to use with the visualization
	    .type("bubbles")       // visualization type
	    .id(["food", "name"]) // nesting keys
	    .depth(1)              // 0-based depth
	    .size("value")         // key name to size bubbles
	    .color("group")      // color by each group
	    .order({value:"food", sort:"desc"})
	    .tooltip("value")
	    .draw();                // finally, draw the visualization!
}

function foodDataToCharts(dataFood, k){
	nutrients = dataFood.nutrients;
	radarAxisData = [];

	for(var i = 0; i<nutrients.length;i++){

		switch(nutrients[i].id){
			case 1:
			case 2:
			case 3:
			case 20:
			case 26:
			case 89:
				radarAxisData.push({axis: nutrients[i].name, value: ((nutrients[i].measures[0].value/dvValues[""+nutrients[i].id])).toFixed(2)});
				break;
			default:
				if(dvValues[""+nutrients[i].id] != undefined){
					bubbleChartData.push(
						{
						 "value": (nutrients[i].measures[0].value/dvValues[""+nutrients[i].id]),
						 "name": (nutrients[i].name.indexOf(",")==-1? nutrients[i].name : nutrients[i].name.substring(0, (nutrients[i].name.indexOf(",")))),
						 "group": nutrients[i].group,
						 "food": "Food "+k
						}
					);
				}
		}
	}

	radarChartData.push(radarAxisData);
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
		html: "<label class=\"lbl-infofood\">Name:</label>"+food.name+
			  "<br /><label class=\"lbl-infofood\">Serving size:</label> "+food.nutrients[0].measures[0].qty+" "+food.nutrients[0].measures[0].label+" ("+food.nutrients[0].measures[0].eqv+"g)"
	}).hide().appendTo("#panelFoodInfo"+n);
}