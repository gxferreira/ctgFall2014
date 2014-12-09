var weight, metric = 0, calories = [], barChartData = [];
var color = ["#b22200","#EACE3F"];

function exercises_function(){

  var div = '.exercises';

  $(div).empty();

  getCalories();

  weight = calculateWeight();

  barChartData = new Array();

  $.getJSON( "secure/exercises.json", function(data) {

    $(div).append('<label class="calorieTitle">Food1: '+calories[0]+' calories - Food2: '+calories[1]+' calories</label>');
       
     $.each(data.exercises, function(key, value){
  //     $(div).append(
  //      '<div class="large-3 medium-3 columns">'+
  //       '<h3 id="'+key+'">'+key+'</h3>'+
  //       '<img src="'+value.image+'"></img>'+
  //       '</div>');
      
      for(var i in calories){
        var minutes = calculateExercises(value.met, key, calories[i], i);
        createBarData(i, key, minutes, value.image, value.group, value.color);
      }


   });

createBarChart();
  

  }).fail(function() {
  		alert('File Not Found');
  });

};

function calculateExercises(met, key, calorie,i){
  var minutes = 0;
  minutes = Math.round((calorie * 60) / (weight * met));
  $('<p style="color:'+color[i]+'">'+minutes+' min</p>').insertAfter('#'+key);
  return minutes;
}

function calculateWeight(){
	weight = $('#weight').val();
	metric = $('#weight-metric').val();
	weight /= metric;
	return weight;
}

function getCalories(){
  calories = new Array();
  for(i=0; i<foodData.length; i++){
    calories.push(foodData[i].report.food.nutrients[1].measures[0].value);
  }
}

function createBarData(i, exercise, minutes, img, group, color){
  i++;
  barChartData.push({"exercise":exercise, "name":"food"+i, "minutes":minutes, "image":img, "group": group, "color":color});
}

function createBarChart(){
   var visualization = d3plus.viz()
    .container("#barChart")
    .data(barChartData)
    .type("bar")
    .id("name")
    .x("group")
    .y("minutes")
    .color("color")
    .icon({
      "style": "knockout",
      "value": "image"
    })
    .tooltip("exercise")
    .legend(false)
    .height(450)
    .draw()
}