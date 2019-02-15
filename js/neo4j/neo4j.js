const bbox = require('@turf/bbox').default;
const area = require('@turf/area').default;
const {
  getElasticBoundingBox,
  convertStringToPolygon
} = require('./spatialfunc');
const {bolturl, username, password} = require('./config');
const booleanDisjoint = require('@turf/boolean-disjoint').default;
const neo4j = require('neo4j-driver').v1;
const {
  getRootNodeForPoint
} = require('./rootnode')
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
const turfHelper = require('@turf/helpers');
const {
  findAllCypher,
  findByPolygonCypher,
  findByPointCypher,
  polyStringCypher,
  userStringCypher,
  polygonToLatCypher,
  polygonToLngCypher
} = require('./cypher');

const driver = neo4j.driver(bolturl, neo4j.auth.basic(username, password));

const addPolygon = (polygon, uuid) => {

  const bb = bbox(polygon);
  let polyArea = area(polygon);

  let insert = {
    uuid: uuid,
    area: polyArea,
    pointString: polygon.geometry.coordinates.toString(),
    bbxMin: bb[0],
    bbyMin: bb[1],
    bbxMax: bb[2],
    bbyMax: bb[3],
  }

  let session = driver.session();
  return session
    .run(polyStringCypher, insert)
    .then(result => {
      session.close();
    })
    .catch(err => {
      session.close();
      throw err;
    });
}



const addUserToPolygon = (email, uuid) => {

  let insert = {
    email: email,
    uuid: uuid,
  }

  let session = driver.session();
  return session
    .run(userStringCypher, insert)
    .then(result => {
      session.close();
    })
    .catch(err => {
      session.close();
      throw err;
    });
}



const addPolygonToAnchor = (uuid, polygon) => {
  const session = driver.session();
  let points = spatial.getExtendedBoundingBox(polygon);
  session.run(polygonToLatCypher, {
      uuid,
      uuid,
      yValues: points[1]
    })
    .then(() => session.run(polygonToLngCypher, {
      uuid,
      uuid,
      xValues: points[0]
    }))
    .then(() => session.close());
}

const add = (poly, uuid, email) => {
  return addPolygon(poly, uuid)
    .then(() => addUserToPolygon(email, uuid))
    .then(() => addPolygonToAnchor(uuid, poly))
    .catch(err => console.log(err));
};


const findByPolygon = (polygon) => {
  return new Promise(function (resolve, reject) {
    let points = getElasticBoundingBox(polygon);
    let session = driver.session();

    let features = [];
    session.run(findByPolygonCypher, {
        xValues: points[0],
        yValues: points[1]
      })
      .then((data) => {
        session.close();
        data.records.forEach(record => {
          let poly = convertStringToPolygon(record.get(0).properties.pointString);
          if (!booleanDisjoint(polygon, poly)) {
            poly.properties.uuid = record.get(0).properties.uuid;
            features.push(poly);
          }
        });
        console.log('records', data.records.length, 'features', features.length);
        resolve(features);

      });
  });
}


const findByPoint = (lng, lat) => {
  return new Promise(function (resolve, reject) {
    let features = [];

    lng = parseFloat(lng);
    lat = parseFloat(lat);
    console.log(lng, lat);

    const nodeRootLevel0 = getRootNodeForPoint(lat, lng, 0.2);
    let session = driver.session();
    return session.run(findByPointCypher, {
      x: lng,
      y: lat,
      lngs: [nodeRootLevel0.lng],
      lats: [nodeRootLevel0.lat],

    }).then((data) => {
      session.close();
      const point = turfHelper.point([lng, lat]);
      console.log('records', data.records.length);
      data.records.forEach(record => {
        let poly = spatial.convertStringToPolygon(record.get(0).properties.pointString);
        if (booleanPointInPolygon(point, poly)) {
          poly.properties.uuid = record.get(0).properties.uuid;
          features.push(poly);
        }
      });
      console.log('records', data.records.length, 'features', features.length);
      resolve(features);
    });
  })
}

const findAll = () => {
  return new Promise(function (resolve, reject) {
    let features = [];

    const session = driver.session(neo4j.session.READ);
    return session.run(findAllCypher)
      .then((data) => {
        session.close();
        data.records.forEach(record => {
          let poly = convertStringToPolygon(record.get(0).properties.pointString);
          poly.properties.uuid = record.get(0).properties.uuid;
          features.push(poly);

        });
        console.log('records', data.records.length);
        resolve(features);
      });
  });

}

module.exports = {
  add: add,
  findByPolygon: findByPolygon,
  findByPoint: findByPoint,
  findAll: findAll,
};