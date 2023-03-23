var client_id = "41ac9db6ecce467d8599629d6506548f";
var client_secret = "f51956f645f54af88673ffe91edcdcec";

fetch("https://accounts.spotify.com/api/token", {
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
    console.log(data);

    fetch("https://api.spotify.com/v1/search?q=sza&type=artist", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + data.access_token,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  });
