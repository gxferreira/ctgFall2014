/**
	SOURCE: http://www.fda.gov/Food/GuidanceRegulation/GuidanceDocumentsRegulatoryInformation/LabelingNutrition/ucm064928.htm

	SOURCE Vitamin E: http://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/

	Nutrients not found: Biotin, Panthotenic acid, Iodine, Selenium, Copper, Manganese
**/
var dvValues = {
	"203":50, //Protein
	"204":65, //Total lipid (fat)
	"205":300, //Carbohydrate, by difference
	"291":25, //Fiber, total dietary
	"306":3500, //Potassium, K
	"307":2400, //Sodium, Na
	"601":300, //Cholesterol
	"318":5000, //Vitamin A, IU
	"401":60, //Vitamin C, total ascorbic acid
	"301":1000, //Calcium, Ca
	"303":18, //Iron, Fe
	"324":400, //Vitamin D
	"323":15, //Vitamin E (alpha-tocopherol)
	"430":80, //Vitamin K (phylloquinone)
	"404":1.5, //Thiamin
	"405":1.7, //Riboflavin
	"406":20, //Niacin
	"415":2, //Vitamin B6
	"417":400, //Folate, total
	"418":6, //Vitamin B12
	"305":1000, //Phosphorus
	"304":400,  //Magnesium, Mg
	"309":15 //Zinc
}

var foodData = [];

var radarChartData;
var bubbleChartData;
var servingSizeScale;
var maxValue;
var selMeasures = [];

function createChart(idContainer){
	radarChartData = [];
	bubbleChartData = [];
	maxValue = 0;
	
	selMeasures = [$("#selectServSize1").val(),$("#selectServSize2").val()];

	LegendOptions = ["Food 1", "Food 2"];

	var colorscale = d3.scale.category10();

	servingSizeScale= d3.scale.linear()
	.domain([0, d3.max([foodData[0].report.food.nutrients[0].measures[selMeasures[0]].eqv, foodData[1].report.food.nutrients[0].measures[selMeasures[1]].eqv])])
	.range([40,80]);

	for(var i = 0; i<foodData.length;i++){
		foodDataToCharts(foodData[i].report.food, i+1);
		loadFoodInfo(foodData[i].report.food, i+1);
	}

	var container = $("#"+idContainer),
	width = container.width();

	/*var chart = RadarChart.chart();
    var cfg = chart.config(); // retrieve default config

    chart.config({maxValue: 50, w: 350, h:320});

    
    var svg = d3.select('#results').append('svg')
      .attr('width', "100%")
      .attr('height', "100%")
      .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
      .attr('preserveAspectRatio','xMinYMin');
    svg.append('g').classed('single', 1).datum(dataChart).call(chart);*/
    var w = 320, h= 250;

    var mycfg = {
    	w: w,
    	h: h,
    	factorLegend: 0.7,
    	TranslateX: 50,
    	maxValue: (parseFloat(maxValue)+ 0.2),
    	levels: 5,
    	radians: 2 * Math.PI
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
	    .tooltip({"html": function(d){ 
	    	return "<a class=\"link-moreinfo\" target=\"_blank\" href=\"https://www.google.com/?gws_rd=ssl#q="+d+"\">More info</a>";}})
	    .height(450)
	    .draw();// finally, draw the visualization!
}

function foodDataToCharts(dataFood, k){
	nutrients = dataFood.nutrients;
	radarAxisData = [];

	for(var i = 0; i<nutrients.length;i++){

		switch(nutrients[i].nutrient_id){
			case 203:
			case 204:
			case 205:
			case 291:
			case 307:
			case 601:
				var nutName = "";
				if(nutrients[i].nutrient_id==205){
					nutName = "Carbohydrate";
				}else{
					nutName = nutrients[i].name;
				}

				if(nutrients[i].measures[selMeasures[k-1]]==undefined){
					//console.log(k);
					//console.log(nutrients[i]);
				}
				radarAxisData.push({axis: nutName, value: ((nutrients[i].measures[selMeasures[k-1]].value/dvValues[""+nutrients[i].nutrient_id])).toFixed(2)});
				maxValue = d3.max([((nutrients[i].measures[selMeasures[k-1]].value/dvValues[""+nutrients[i].nutrient_id])).toFixed(2), maxValue]);
				break;
			default:
				if(dvValues[""+nutrients[i].nutrient_id] != undefined){
					bubbleChartData.push(
						{
						 "value": (nutrients[i].measures[selMeasures[k-1]].value/dvValues[""+nutrients[i].nutrient_id])*100,
						 "name": (nutrients[i].name.indexOf(",")==-1? nutrients[i].name : nutrients[i].name.substring(0, (nutrients[i].name.indexOf(",")))),
						 "group": nutrients[i].group,
						 "food": dataFood.name
						}
					);
				}
		}
	}

	radarChartData.push(radarAxisData);
}

function pushFoodData(food, idx){
	var rmv = 0;
	
	if(foodData.length==2)
		rmv= 1

	foodData.splice(idx, rmv, food);


	$("#selectServSize"+(idx+1)).empty();

	food.report.food.nutrients[0].measures.forEach(function(element, i){
		$("<option/>",{
			"value":i,
			"html":element.qty+" "+element.label
		}).appendTo("#selectServSize"+(idx+1));
	});
}

function cleanFoodData(){
	$("#results").empty();
	$(".div-serving-size").empty();
	$(".food-info").remove();
}

function updateServingSizes(){
	
}

function loadFoodInfo(food, n, scale){
	$("<div/>", {
		"class": "food-info",
		html: "<label class=\"foodTitle\">Food "+n+"</label>"+
			  "<label class=\"lbl-infofood\">Name:</label>"+food.name+
			  "<label class=\"lbl-infofood\">Serving size:</label> "+food.nutrients[0].measures[selMeasures[n-1]].qty+" "+food.nutrients[0].measures[selMeasures[n-1]].label
	}).hide().insertBefore("#divServingSize"+n);
	
	var svgCont = d3.select("#divServingSize"+n).append("svg").attr("width",160).attr("height",160)
	.append("g").attr("transform","translate(80,80)");
	
	svgCont.append("circle")
	.attr("r", servingSizeScale(food.nutrients[0].measures[selMeasures[n-1]].eqv))
	.attr("fill","green");

	var valOz = (food.nutrients[0].measures[selMeasures[n-1]].eqv*0.035274).toFixed(2);

	svgCont.append("text")
	.attr("dx", -25)
	.attr("fill", "white")
	.attr("class", "svg-text-serving")
    .attr("dy", ".35em")
    .text(valOz+" oz");
}