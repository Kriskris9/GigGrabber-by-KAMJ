var button = document.querySelector("#search");
var box = document.querySelector(".spotify-box");
var search = document.querySelector(".input");
var spot = document.querySelector(".spotify");

// funciton that gets token
function getToken() {
  var client_id = window.env.SPOTIFY_CLIENT;
  var client_secret = window.env.SPOTIFY_SECRET;
  return fetch(
    "https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(client_id + ":" + client_secret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}

// gets token, gets artist id, then gets artist top tracks
function topTracks(input) {
  box.innerHTML = "";
  getToken().then(function (data) {
    return fetch(`https://api.spotify.com/v1/search?q=${input}&type=artist`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + data.access_token,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (resp) {
        artistID = resp.artists.items[0].id;

        fetch(
          `https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + data.access_token,
            },
          }
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (resp) {
            var songStorage = [];

            for (let i = 0; i < 5; i++) {
              var spotifySong = resp.tracks[i].name;
              var spotifyLink = resp.tracks[i].external_urls.spotify;

              obj = {
                song: spotifySong,
                link: spotifyLink,
              };
              songStorage.push(obj);
              storage(spotifySong, spotifyLink);
            }
            localStorage.setItem("songInfo", JSON.stringify(songStorage));
          });
      });
  });
}

// function for appending top songs to page
function storage(song, link) {
  var songName = document.createElement("a");
  songName.setAttribute("href", link);
  songName.innerHTML = song;
  songName.style.display = "block";
  box.append(songName);
}

// gets storage and calls storage function to append to page.
//  if there is no local storage, we wont display the spotify top tracks side bar.
function getStorage() {
  lastSearch = JSON.parse(localStorage.getItem("songInfo"));
  if (lastSearch === null) {
    spot.style.display = "none";
  } else {
    lastSearch.forEach(function (s) {
      storage(s.song, s.link);
      spot.style.display = "block";
    });
  }
}

// calling search artist function with an argument of the input
function searchArtist(event) {
  event.preventDefault();
  input = search.value.trim();
  topTracks(input);
  spot.style.display = "block";
}

// event listener for the search button calling search artist
button.addEventListener("click", searchArtist);

// click event for the top 10 streaming artist
art.forEach(function (e) {
  e.addEventListener("click", function () {
    topTracks(e.textContent);
    spot.style.display = "block";
  });
});

getStorage();
