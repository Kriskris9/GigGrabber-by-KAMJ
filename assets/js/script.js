apiKey = "e903f7c8560c58a90ec3791a2fff9dd7";
console.log(apiKey);

var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", apiKey);
myHeaders.append("x-rapidapi-host", "v1.formula-1.api-sports.io");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

function getTrack() {
  fetch("https://v1.formula-1.api-sports.io/competitions", requestOptions)
    .then((response) => response.text())
    .then(function (result) {
      var data = JSON.parse(result);
      console.log(data.response);
    })

    .catch((error) => console.log("error", error));
}

getTrack();

// https://api-sports.io/documentation/formula-1/v1#section/Sample-Scripts/Swift
