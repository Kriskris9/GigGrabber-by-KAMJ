var button = document.querySelector("button");
var box = document.querySelector(".spotify-box");
var search = document.querySelector(".input");
var spot = document.querySelector(".spotify");

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

function storage(song, link) {
  var songName = document.createElement("a");
  songName.setAttribute("href", link);
  songName.innerHTML = song;
  songName.style.display = "block";
  box.append(songName);
}

function getStorage() {
  lastSearch = JSON.parse(localStorage.getItem("songInfo"));
  if (lastSearch === null) {
    spot.style.display = "none";
  } else {
    lastSearch.forEach(function (s) {
      var songName = document.createElement("a");
      storage(s.song, s.link);
    });
  }
}

function searchArtist(event) {
  event.preventDefault();
  mediaQ(x);

  topTracks(search.value);
}

button.addEventListener("click", searchArtist);

art.forEach(function (e) {
  e.addEventListener("click", function () {
    mediaQ(x);
    topTracks(e.textContent);
  });
});

getStorage();

function mediaQ(x) {
  if (x.matches) {
    spot.style.display = "none";
  } else {
    spot.style.display = "block";
  }
}
var x = window.matchMedia("(max-width: 800px)");
x.addListener(mediaQ);
