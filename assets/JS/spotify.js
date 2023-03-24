function getToken() {
  var client_id = window.env.SPOTIFY_CLIENT;
  var client_secret = window.env.SPOTIFY_SECRET;
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}

function searchArtist() {
  getToken().then(function (data) {
    fetch("https://api.spotify.com/v1/search?q=sza&type=artist", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + data.access_token,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (resp) {
        console.log(resp.artists.items[0].id);
      });
  });
}

searchArtist();
