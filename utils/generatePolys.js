const turfHelper = require('@turf/helpers');
const axios = require('axios');

x = [-4.4, -4.2, -4.0, -3.8, -3.6, -3, 4, -3.2, -3.0];

(async function loop() {
  for (let x = -6.7; x <= 0.1;) {
    for (let y = 50.4; y <= 58.1;) {
      if (Math.random()) {
        let coords;
        if (Math.random() > 0.5) {
          coords = [
            [x, y],
            [x, y + 0.1],
            [x + 0.05, y + 0.1],
            [x, y]
          ];
        } else {
          coords = [
            [x, y],
            [x, y + 0.1],
            [x + 0.1, y + 0.1],
            [x + 0.1, y],
            [x, y]
          ];
        }

        let poly = turfHelper.polygon([coords]);
        poly.properties.email = 't@gmail.com';
        console.log(poly);
        await axios.post('http://localhost:3000/index/add', poly);
      }
      y = y + 0.23;
    }
    x = x + 0.23;
  }
})();