var apiKey = "6be52531f600559ee21d8cdbe9532e8d"
var locations = [""];
var cityStorage = JSON.parse(localStorage.getItem("locations")) || [];

function localWeather(cityData) {
  $("#location-search").empty()
 
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityData +
    "&units=imperial&appid=" +
    apiKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
   
    var date = moment().format("l");
 
    var weatherImg = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        response.weather[0].icon +
        "@2x.png"
    );
    var wthrDiv = $("<div id='wthrDiv'>");
    var tempF = response.main.temp;
   
    var newH4 = $("<h4>").text(response.name + " (" + date + ") ");
    newH4.append(weatherImg);
    wthrDiv.append(newH4);
    wthrDiv.append($("<p>").text("Temperature: " + tempF.toFixed(2) + " F"));
    wthrDiv.append($("<p>").text("Wind Speed: " + response.wind.speed + " MPH"));
    wthrDiv.append($("<p>").text("Humidity: " + response.main.humidity + "%"));
    $("#location-search").prepend(wthrDiv);
    fiveDayForecast(cityData);

var uvCords = [response.coord.lat, response.coord.lon]
uvIndex(uvCords)
  });
}           

function uvIndex (uvCords){
  var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=c9288340a0d00c00e02bf6e9f809e872&lat=" + uvCords[0] + "&lon=" + uvCords[1]
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    var uvText = response.value
    var uvBadge = $("<span>").addClass("badge").text(uvText)
    var uvCords = response.value 
  
    $("#wthrDiv").append("UV Index: ").append(uvBadge)
  
    if (uvCords < 3){
      uvBadge.addClass("uv1")
    }
    else if (uvCords<5) {
      uvBadge.addClass("uv2")
    }
    else if (uvCords < 8){
      uvBadge.addClass("uv3")
    }
    else {
      uvBadge.addClass("uv4")
    }
})
}

function renderCity() {
  $("location-list").empty();
 
  if (cityStorage.length === 0) return;
  for (var i = 0; i < cityStorage.length; i++) {
    var newLi = $("<li>");
    newLi.addClass("li-location list-group-item");
    newLi.attr("data-city", cityStorage[i]);
    newLi.text(cityStorage[i]);
    $("#location-list").prepend(newLi);
  }
  localWeather(cityStorage[cityStorage.length - 1]);
}

function fiveDayForecast(cityData) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?" +
    "q=" +
    cityData +
    "&units=imperial&appid=" +
    apiKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
   
    $('#five-forecast').empty()
    var fiveH4 = $("<h4>").text("Five Day Forecast");
    $('#five-forecast').append(fiveH4);
    var fiveDiv = $("#forecast");
    fiveDiv.empty()
    for (var i = 0; i <= response.list.length -1; i++) {
      
      var time = response.list[i].dt_txt
    
      if (time.includes("15:00:00")) {
        
        var colSm = $("<div>").addClass("col-sm-2 forecast text-light mx-1");
        var weatherImg = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            response.list[i].weather[0].icon +
            "@2x.png"
        );
        var tempF = response.list[i].main.temp;
        var newDate = moment.unix(response.list[i].dt).format("l")
        colSm.append("<h5 class ='mx-5 mt-4'>"+newDate+"</h5>")
        colSm.append(weatherImg);
        colSm.append(
          $("<p>").text("Temperature: " + tempF.toFixed(2)+ " F")
        );
        colSm.append(
          $("<p>").text("Wind Speed: " + response.list[i].wind.speed + " MPH") 
        );
        colSm.append(
          $("<p>").text("Humidity: " + response.list[i].main.humidity + "%")
        );
        fiveDiv.append(colSm)
      }
    }
  });
}

$("#find-location").on("click", function(event) {
  $("location-input").empty();
  event.preventDefault();
  var cityForm = $("#location-input")
    .val()
    .trim();
  if (cityForm === "") return;
  cityStorage.push(cityForm);
  localStorage.setItem("locations", JSON.stringify(cityStorage));
  $("#location-input").val("");
  renderCity();
});

$("#location-list").on("click", ".li-location", function() {
  localWeather($(this).attr("data-city"));
});
renderCity();