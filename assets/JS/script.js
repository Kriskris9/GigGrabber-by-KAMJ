var search = document.querySelector(".input");
var button = document.querySelector("button");
var bitResults = document.querySelector(".card-container");
var topArtist = document.querySelector("#top-artist");
var head = document.querySelector(".header-bandsintown");
var aside = document.querySelector("aside");
var id = "edc48f414ecacffb0e5d6e0406e465b6";
var input;
var actualInput;

function getArtist(input) {
  fetch(`https://rest.bandsintown.com/artists/${input}/?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      var artistImg = data.image_url;
      
      console.log(artistImg);
      var profilePic = document.createElement("img")
      profilePic.src = artistImg;
      head.append(profilePic);

profilePic.style.borderRadius = '50%';
profilePic.style.width = '50px';
profilePic.style.objectFit = 'cover';

    });
}

function getConcerts(input) {
  getArtist(input);
  fetch(`https://rest.bandsintown.com/artists/${input}/events?app_id=${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      bitResults.innerHTML = "";
      head.innerHTML = "";


      if (data.errorMessage){
        var noResults= document.createElement("h3");
        noResults.innerHTML= "No Results Found " + actualInput;
        head.append(noResults);
        error = {
          artistName: actualInput,
          noResults: "error",
        }
        localStorage.setItem("concertInfo", JSON.stringify(error))   
      
    }

     else if (Object.keys(data).length === 0) {
        var empty = document.createElement("h3");
        empty.innerHTML = "No search results for " + actualInput;
        head.append(empty);

        concertInfo = {
          isEmpty: "empty",
          artistName: actualInput,
        };
        localStorage.setItem("concertInfo", JSON.stringify(concertInfo));
      } else {
        var showing = document.createElement("h3");
        showing.innerHTML = "Showing concert results for " + actualInput;
        head.append(showing);
        var concertInfo = [];

        data.forEach(function (c) {
          var card = document.createElement("div");
          card.className = "card";
          var infoVenue = document.createElement("p");
          var infoDate = document.createElement("p");
          var infoCity = document.createElement("p");

          var venue = c.venue.name;
          var date = c.datetime;
          var city = c.venue.city;
          var state = c.venue.region;
        

          obj = {
            artistName: actualInput,
            venueStorage: venue,
            dateStorage: date,
            cityStorage: `${city}, ${state}`,
          };

          concertInfo.push(obj);

          infoVenue.innerHTML = venue;
          infoDate.innerHTML = date;
          infoCity.innerHTML = `${city}, ${state}`;

          card.append(infoVenue);
          card.append(infoDate);
          card.append(infoCity);
          bitResults.append(card);
        });

        localStorage.setItem("concertInfo", JSON.stringify(concertInfo));
      }
    });
}

function getStorage() {
  lastSearch = JSON.parse(localStorage.getItem("concertInfo"));
  if (lastSearch.noResults){
    var noResults= document.createElement("h3");
        noResults.innerHTML= "No Results Found " + lastSearch.artistName;
        head.append(noResults);

  }
  else if (lastSearch.isEmpty) {
    var empty = document.createElement("h3");
    empty.innerHTML = "No search results for " + lastSearch.artistName;
    head.append(empty);
  } else {
    var showing = document.createElement("h3");
    showing.innerHTML =
      "Showing concert results for " + lastSearch[0].artistName;
    head.append(showing);

    lastSearch.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "card";
      var infoVenue = document.createElement("p");
      var infoDate = document.createElement("p");
      var infoCity = document.createElement("p");

      infoVenue.innerHTML = s.venueStorage;
      infoDate.innerHTML = s.dateStorage;
      infoCity.innerHTML = s.cityStorage;

      card.append(infoVenue);
      card.append(infoDate);
      card.append(infoCity);
      bitResults.append(card);
    });
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
getStorage();
