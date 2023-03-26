// bandsintown API

var search = document.querySelector(".input");
var button = document.querySelector("#search");
var clear = document.querySelector("#clear");
var bitResults = document.querySelector(".card-container");
var topArtist = document.querySelector("#top-artist");
var head = document.querySelector(".header-bandsintown");
var aside = document.querySelector("aside");
var spot = document.querySelector(".box");
var art = document.querySelectorAll(".top-artist-name");
var id = window.env.BIT_KEY;
var input;
var actualInput;

// function for appending elements to page when there is a 404 error
function noResults(name) {
  var noResults = document.createElement("h2");
  noResults.innerHTML = "No Results Found " + name;
  head.append(noResults);
}

// function for appending elements to page for artist who have no upcoming concerts
function noConcerts(artistImg, artistName) {
  var empty = document.createElement("h2");
  empty.innerHTML = "No upcoming concerts for " + artistName;
  head.append(empty);

  var profilePic = document.createElement("img");
  profilePic.src = artistImg;
  profilePic.style.borderRadius = "50%";
  profilePic.style.border = "1px solid black";
  profilePic.style.width = "50px";
  profilePic.style.objectFit = "cover";
  head.append(profilePic);
}

// function for appending elements to page for artist with upcoming concerts
function successConcerts(venue, date, location) {
  var card = document.createElement("div");
  card.className = "card";
  var infoVenue = document.createElement("p");
  var infoDate = document.createElement("p");
  var infoCity = document.createElement("p");

  infoVenue.innerHTML = venue;
  infoDate.innerHTML = date;
  infoCity.innerHTML = location;

  card.append(infoVenue);
  card.append(infoDate);
  card.append(infoCity);
  bitResults.append(card);
}
// function for appending a profile picture for artist with upcoming concerts
function successConcertsImg(artistName, artistImg) {
  var showing = document.createElement("h2");
  showing.innerHTML = "Showing concert results for " + artistName;
  head.append(showing);
  var profilePic = document.createElement("img");
  profilePic.src = artistImg;
  profilePic.style.borderRadius = "50%";
  profilePic.style.border = "1px solid black";
  profilePic.style.width = "50px";
  profilePic.style.objectFit = "cover";
  head.append(profilePic);
}

// function that gets artist img and name from the artist endpoint. were are passing the user input as a argument.
// we are returning a value to access it in the get concerts function.
function getArtist(input) {
  return fetch(`https://rest.bandsintown.com/artists/${input}/?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return [data.image_url, data.name];
    });
}

// this function uses the concerts endpoint to get upcoming concerts for an inputed artist.
// if there is an error in the api we call the no results funciton
// if there are no concerts for an artist we call the no results function.
// if there are upcoming concerts we call the success concerts function.
// we are then storing the values we need in a object
function getConcerts(input) {
  bitResults.innerHTML = "";
  head.innerHTML = "";
  fetch(`https://rest.bandsintown.com/artists/${input}/events?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.errorMessage) {
        noResults(actualInput);
        error = {
          artistName: actualInput,
          noResults: "error",
        };
        localStorage.setItem("concertInfo", JSON.stringify(error));
      } else {
        getArtist(input).then(function (artistData) {
          var artistImg = artistData[0];
          var artistName = artistData[1];

          if (Object.keys(data).length === 0) {
            noConcerts(artistImg, artistName);
            concertInfo = {
              isEmpty: "empty",
              artistName: artistName,
              imageStorage: artistImg,
            };
            localStorage.setItem("concertInfo", JSON.stringify(concertInfo));
          } else {
            var concertInfo = [];
            data.forEach(function (c) {
              var venue = c.venue.name;
              var d = c.datetime;
              d1 = d.split("T");
              date = d1[0];
              var location = `${c.venue.city} ${c.venue.region}`;

              obj = {
                artistName: artistName,
                venueStorage: venue,
                dateStorage: date,
                cityStorage: location,
                imageStorage: artistImg,
              };
              concertInfo.push(obj);
              successConcerts(venue, date, location);
            });
            localStorage.setItem("concertInfo", JSON.stringify(concertInfo));

            successConcertsImg(artistData[1], artistData[0]);
          }
        });
      }
    });
}

// this function gets local storage and appends to the page/
function getStorage() {
  lastSearch = JSON.parse(localStorage.getItem("concertInfo"));
  if (lastSearch === null) {
  } else {
    if (lastSearch.noResults) {
      noResults(lastSearch.artistName);
    } else if (lastSearch.isEmpty) {
      noConcerts(lastSearch.imageStorage, lastSearch.artistName);
    } else {
      lastSearch.forEach(function (s) {
        successConcerts(s.venueStorage, s.dateStorage, s.cityStorage);
      });
      successConcertsImg(lastSearch[0].artistName, lastSearch[0].imageStorage);
    }
  }
}

// this function gets the input value and calls the get concert function.
function searchArtist(event) {
  event.preventDefault();
  actualInput = search.value;
  input = search.value.trim();
  if (input.includes(" ")) {
    input = input.replace(" ", "%20");
  }
  getConcerts(input, actualInput);
}

// click event for search artist function
button.addEventListener("click", searchArtist);

// function to clear local storage to get back to home page
clear.addEventListener("click", function () {
  localStorage.clear();
});

// click event for the top 10 streaming artist
art.forEach(function (e) {
  e.addEventListener("click", function () {
    getConcerts(e.textContent, e.textContent);
  });
});

getStorage();
