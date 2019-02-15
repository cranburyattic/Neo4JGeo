const bbox = require('@turf/bbox').default;
const area = require('@turf/area').default;
const {
  getElasticBoundingBox,
} = require('./spatialfunc');
const {
  bolturl,
  username,
  password
} = require('./config');
const neo4j = require('neo4j-driver').v1;
const {
  getRootNodeForPoint
} = require('./rootnode')
const {
  findAllCypher,
  findByPolygonCypher,
  findByPointCypher,
  polyStringCypher,
  userStringCypher,
  polygonToLatCypher,
  polygonToLngCypher
} = require('./cypher');
const {
  findAllHandler,
  findByPointHandler,
  findByPolygonHandler,
} = require('./handlers');

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
    runQuery(findByPolygonCypher, {
        xValues: points[0],
        yValues: points[1]
      })
      .then(data => resolve(findByPolygonHandler(data, polygon)));
  });
}

const findByPoint = (lng, lat) => {
  return new Promise(function (resolve, reject) {
    lng = parseFloat(lng);
    lat = parseFloat(lat);
    const nodeRootLevel = getRootNodeForPoint(lat, lng, 0.2);
    const insert = {
      x: lng,
      y: lat,
      lngs: [nodeRootLevel.lng],
      lats: [nodeRootLevel.lat],
    }
    return runQuery(findByPointCypher, insert)
      .then(data => resolve(findByPointHandler(data, lat, lng)));
  });
}

const findAll = () => {
  return new Promise(function (resolve, reject) {
    return runQuery(findAllCypher)
      .then(data => resolve(findAllHandler(data)));
  });
}

const runQuery = (query, inserts) => {
  let session = driver.session();
  return session.run(query, inserts)
    .then(data => {
      session.close();
      return data;
    });
}

module.exports = {
  add: add,
  findByPolygon: findByPolygon,
  findByPoint: findByPoint,
  findAll: findAll,
};