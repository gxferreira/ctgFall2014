var weight, metric = 0, calories = [];
 
function exercises_function(){
  var div = '.exercises';

  $(div).empty();

  getCalories();

  weight = calculateWeight();

  $.getJSON( "secure/exercises.json", function(data) {

    $.each(data.exercises, function(key, value){

      $(div).append(
        '<div class="col">'+
        '<h3 id="'+key+'">'+key+'</h3>'+
        '<img src="'+value.image+'"></img>'+
        '</div>');
      
      calculateExercises(value.met, key);

  });

  }).fail(function() {
  		alert('File Not Found');
  });

};

function calculateExercises(met, key){
  var minutes = 0;
  for( var i in calories){
    minutes = Math.round((calories[i] * 60) / (weight * met));
    $('<p>'+minutes+' min</p>').insertAfter('#'+key);
  }
}

function calculateWeight(){
	weight = $('#weight').val();	
	metric = $('#weight-metric').val();
	weight *= metric;
	return weight;
}

function getCalories(){
  calories = new Array();
  for(i=0; i<foodData.length; i++){
    calories.push(foodData[i].report.food.nutrients[1].measures[0].value);
  }
}