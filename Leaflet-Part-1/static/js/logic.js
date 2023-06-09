// Create a map object.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3,
});

// Add a tile layer.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);

  // Pass the features to a createFeatures() function:
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h3>Where: " +
      feature.properties.place +
      "</h3><hr><p>Time: " +
      new Date(feature.properties.time) +
      "</p><hr><p>Magnitude: " +
      feature.properties.mag +
      "</p>" +
      "<br>Depth: " +
      feature.geometry.coordinates[2]
    );
  }

  function createCircleMarker(feature, latlng) {
    console.log(latlng);
    let options = {
      radius: markerSize(feature.properties.mag),
      fillColor: magColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 0.3,
      opacity: 0.5,
      fillOpacity: 0.85
    };
    return L.circleMarker(latlng, options);
  }

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  createMap(earthquakes);
}

function markerSize(mag) {
  return mag * 5;
}

function magColor(mag) {
  if (mag <= 1) {
    return "#FFFFE8";
  } else if (mag <= 20) {
    return "#DAF5FF";
  } else if (mag <= 30) {
    return "#B9E9FC";
  } else if (mag <= 40) {
    return "#D6E8DB";
  } else if (mag <= 50) {
    return "#99A98F";
  } else {
    return "#116A7B";
  }
}

function createMap(earthquakes) {
  // Add the earthquake layer to the map.
  earthquakes.addTo(myMap);
}
 // create legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");
  var magnitude = [0, 20, 30, 40, 50, 60];
  var labels = [];
  var legendInfo = "<h4>Depth</h4>";

  div.innerHTML = legendInfo;

  // loop through the magnitude data to label and color the legend
  for (var i = 0; i < magnitude.length; i++) {
    labels.push(
      '<li style="background-color:' +
        magColor(magnitude[i]) +
        '"> <span>' +
        magnitude[i] +
        (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "" : "+") +
        "</span></li>"
    );
  }

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";

  return div;
};

// add legend to map
legend.addTo(myMap);
