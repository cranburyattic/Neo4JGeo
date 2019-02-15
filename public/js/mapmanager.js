export const addTile = (map) => {
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY3JhbmJ1cmF5YXR0aWMiLCJhIjoiY2phYTM1MGlmMGtjNDMybmlmc2dtZjk1ZiJ9.aChtsB53FDwMh4aqRUtleQ'
  }).addTo(map);
}

export const addControl = (map) => {
  let drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  let drawControl = new L.Control.Draw({
    draw: {
      circle: false,
      polyline: false,
      polygon: {
        allowIntersection: false
      }
    },
    circle: false,
    edit: {
      poly: {
        allowIntersection: false,
      },
      featureGroup: drawnItems,

    }
  });
  map.addControl(drawControl);
  return drawnItems;
}

export const loadAllPolygons = (map) => {
  const savedStyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.0,
    onEachFeature: function (feature, layer) {
      layer.bindPopup('<h1>' + feature.properties.uuid + '</h1>')
    }
  };
  fetch('/spatial/findAll', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    L.geoJSON(data, savedStyle).addTo(map);
  });
}
