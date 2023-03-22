var search = document.querySelector(".input");
var button = document.querySelector("button");
var bitResults = document.querySelector(".results-bandsintown");
var topArtist = document.querySelector("#top-artist");
var id = "edc48f414ecacffb0e5d6e0406e465b6";
var input;

function getArtist(input) {
  fetch(`https://rest.bandsintown.com/artists/${input}/?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getConcerts(input) {
  fetch(`https://rest.bandsintown.com/artists/${input}/events?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      venues = [];
      dates = [];
      city = [];
      state = [];

      var concertInfo = [];
      bitResults.innerHTML = "";

      data.forEach(function (c) {
        var card = document.createElement("article");
        card.className = "card";
        var infoVenue = document.createElement("p");
        var infoDate = document.createElement("p");
        var infoCity = document.createElement("p");
        var infoState = document.createElement("p");

        var venue = c.venue.name;
        var date = c.datetime;
        var city = c.venue.city;
        var state = c.venue.region;

        obj = {
          venueStorage: venue,
          dateStorage: date,
          cityStorage: city,
          stateStorage: state,
        };

        concertInfo.push(obj);

        infoVenue.innerHTML = venue;
        infoDate.innerHTML = date;
        infoCity.innerHTML = city;
        infoState.innerHTML = state;

        card.append(infoVenue);
        card.append(infoDate);
        card.append(infoCity);
        card.append(infoState);
        bitResults.append(card);
      });

      localStorage.setItem("concertInfo", JSON.stringify(concertInfo));
    });
}

function getStorage() {
  var lastSearch = JSON.parse(localStorage.getItem("concertInfo"));

  lastSearch.forEach(function (s) {
    var card = document.createElement("article");
    card.className = "card";
    var infoVenue = document.createElement("p");
    var infoDate = document.createElement("p");
    var infoCity = document.createElement("p");
    var infoState = document.createElement("p");

    infoVenue.innerHTML = s.venueStorage;
    infoDate.innerHTML = s.dateStorage;
    infoCity.innerHTML = s.cityStorage;
    infoState.innerHTML = s.stateStorage;

    card.append(infoVenue);
    card.append(infoDate);
    card.append(infoCity);
    card.append(infoState);
    bitResults.append(card);
  });
}

function searchArtist(event) {
  event.preventDefault();

  input = search.value.trim();
  if (input.includes(" ")) {
    input = input.replace(" ", "%20");
    console.log(input);
  } else {
    console.log(input);
  }
  getConcerts(input);
}

button.addEventListener("click", searchArtist);
getStorage();
