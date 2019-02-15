import 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {
  polygon
} from '@turf/helpers';
import {
  addTile,
  addControl,
  loadAllPolygons
} from './mapmanager';

const loadMap = () => {
  const foundStyle = {
    "color": "#85e085",
    "weight": 1,
    "opacity": 0.4
  };

  let element = document.createElement('div');
  element.id = 'map';
  let map = L.map(element)

  addTile(map);
  loadAllPolygons(map);

  let drawnItems = addControl(map);

  map.on(L.Draw.Event.CREATED, function (event) {
    let x = document.querySelector('input[name="mode"]:checked').value
    if (x === 'edit') {
      let layer = event.layer;

      let points = event.layer._latlngs[0].map((element) => {
        return [element.lng, element.lat];
      })
      // duplicate the first point to complete the polygon
      points.push(points[0]);
      let poly = polygon([points]);
      poly.properties.email = 'test@gmail.com';
      fetch('/spatial/add', {
        method: 'post',
        body: JSON.stringify(poly),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(function (response) {
        return response;
      }).then(function () {});
      drawnItems.addLayer(layer);
    } else {
      if (event.layerType === 'marker') {

        let lng = event.layer._latlng.lng;
        let lat = event.layer._latlng.lat;
        fetch(`/spatial/findByPoint/${lng}/${lat}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          L.geoJSON(data, foundStyle).addTo(map);
        });
      } else {
        let points = event.layer._latlngs[0].map((element) => {
          return [element.lng, element.lat];
        })
        // duplicate the first point to complete the polygon
        points.push(points[0]);
        let poly = polygon([points]);
        fetch('/spatial/findByPolygon', {
          method: 'post',
          body: JSON.stringify(poly),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          L.geoJSON(data, foundStyle).addTo(map);
        });
      }
    }

  });
  return {
    element: element,
    map: map
  };
};

function configureMap() {
  let result = loadMap();
  window.document.body.appendChild(result.element);
  // setView after the element has been added to the
  // DOM else the tiles don't render properly
  result.map.setView([51.8476, 0], 5).setZoom(5);
}
configureMap();