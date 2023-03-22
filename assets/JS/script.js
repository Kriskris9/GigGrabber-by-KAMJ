var id = "edc48f414ecacffb0e5d6e0406e465b6";
var input = docoument.querySelector("#input");
var button = document.querySelector("button")


function searchArtist () {
console.log(input.value);
}

button.addEventListener("click",searchArtist);

fetch(` https://rest.bandsintown.com/artists/SZA/?app_id=${id}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });