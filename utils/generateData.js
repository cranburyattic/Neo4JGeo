const turfHelper = require('@turf/helpers');
const uuidv1 = require('uuid/v1');
const bbox = require('@turf/bbox').default;
const spatial = require('./neo4j/spatial');
const fs = require('fs');


const email = ['Dave@a.com', 'Phil@a.com', 'Jane@a.com', 'Sarah@a.com', 'Bob@a.com',
    'Pete@a.com', 'Indy@a.com', 'Faz@a.com', 'Arial@a.com', 'Courier@a.com',
    'Jay@a.com', 'H@a.com', 'Verify@a.com', 'Amar@a.com', 'Bruno@a.com',
    'Jess@a.com', 'Sally@a.com', 'Rachel@a.com', 'Dirrup@a.com', 'Zach@a.com'
]

const randomLng = () => {
    return random(-180, 180);
}

const randomLat = () => {
    return random(-90, 90);
}

const random = (min, max) => {
    return Math.random() * (max - min) + min;
}


for (let i = 0; i < 50; i++) {

    let lat = randomLat();
    let lng = randomLng();

    let poly = turfHelper.polygon([
        [
            [lng, lat],
            [lng + 0.4, lat + 0.4],
            [lng + 0.8, lat],
            [lng, lat]
        ]
    ]);
    uuid = uuidv1();

    const bb = bbox(poly);
    let polyOutput = uuid + '|' + poly.geometry.coordinates.toString() + '|' + bb[0] + '|' + bb[1] + '|' + bb[2] + '|' + bb[3];
    fs.appendFile('poly.txt', polyOutput + '\n', 'utf-8', (res, err) => console.log(res));

    let emailOutput = email[i % 20] + '|' + uuid;
    fs.appendFile('email.txt', emailOutput + '\n', 'utf-8', (res, err) => console.log(res));
    const nodeRootPoints = spatial.generateNodeRootPoints(poly);
    nodeRootPoints.forEach(element => {
        fs.appendFile('anchor.txt', uuid + '|' + element[0] + '|' + element[1] + '\n', 'utf-8', (res, err) => console.log(res));
    });
}
