var search = document.querySelector(".input");
var button = document.querySelector("button");
var bitResults = document.querySelector(".results-bandsintown");
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
      data.forEach(function (c) {
        var card = document.createElement("article");
        card.className = "card";
        var infoVenue = document.createElement("p");
        var infoDate = document.createElement("p");

        var venue = c.venue.name;
        var date = c.datetime;

        infoVenue.innerHTML = venue;
        infoDate.innerHTML = date;

        card.append(infoVenue);
        card.append(infoDate);
        bitResults.append(card);
      });
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
  //   getArtist(input);
  getConcerts(input);
}

button.addEventListener("click", searchArtist);
