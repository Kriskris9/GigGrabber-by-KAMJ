var search = document.querySelector(".input");
var button = document.querySelector("button");
var bitResults = document.querySelector(".card-container");
var topArtist = document.querySelector("#top-artist");
var head = document.querySelector(".header-bandsintown");
var aside = document.querySelector("aside");
var spot = document.querySelector(".box");
var art = document.querySelectorAll(".top-artist-name");
var id = window.env.BIT_KEY;
var input;
var actualInput;

function noResults(name) {
  var noResults = document.createElement("h2");
  noResults.innerHTML = "No Results Found " + name;
  head.append(noResults);
}

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

function getArtist(input) {
  return fetch(`https://rest.bandsintown.com/artists/${input}/?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return [data.image_url, data.name];
    });
}

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
              var location = `${c.venue.city}, ${c.venue.region}`;

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
            var showing = document.createElement("h2");
            showing.innerHTML = "Showing concert results for " + artistData[1];
            head.append(showing);
            profilePic = document.createElement("img");
            profilePic.src = artistData[0];
            profilePic.style.borderRadius = "50%";
            profilePic.style.border = "1px solid black";
            profilePic.style.width = "50px";
            profilePic.style.objectFit = "cover";
            head.append(profilePic);
          }
        });
      }
    });
}

function getStorage() {
  lastSearch = JSON.parse(localStorage.getItem("concertInfo"));

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

function searchArtist(event) {
  event.preventDefault();
  actualInput = search.value;
  input = search.value.trim();
  if (input.includes(" ")) {
    input = input.replace(" ", "%20");
  }
  getConcerts(input, actualInput);
}

button.addEventListener("click", searchArtist);

art.forEach(function (e) {
  e.addEventListener("click", function () {
    getConcerts(e.textContent, e.textContent);
  });
});

getStorage();
