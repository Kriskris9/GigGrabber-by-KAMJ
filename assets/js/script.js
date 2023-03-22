var id = "edc48f414ecacffb0e5d6e0406e465b6";

fetch(` https://rest.bandsintown.com/artists/Justin%20Bieber/?app_id=${id}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
