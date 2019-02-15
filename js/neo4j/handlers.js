const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
const turfHelper = require('@turf/helpers');
const booleanDisjoint = require('@turf/boolean-disjoint').default;
const {
  convertStringToPolygon
} = require('./spatialfunc');

const findByPolygonHandler = (data, polygon) => {
  let features = [];
  data.records.forEach(record => {
    let poly = convertStringToPolygon(record.get(0).properties.pointString);
    if (!booleanDisjoint(polygon, poly)) {
      poly.properties.uuid = record.get(0).properties.uuid;
      features.push(poly);
    }
  });
  console.log('records', data.records.length, 'features', features.length);
  return features;
}

const findByPointHandler = (data, lat, lng) => {
  const point = turfHelper.point([lng, lat]);
  let features = [];
  data.records.forEach(record => {
    let poly = convertStringToPolygon(record.get(0).properties.pointString);
    if (booleanPointInPolygon(point, poly)) {
      poly.properties.uuid = record.get(0).properties.uuid;
      features.push(poly);
    }
  })
  return features;
}

const findAllHandler = (data) => {
  let features = [];
  data.records.forEach(record => {
    let poly = convertStringToPolygon(record.get(0).properties.pointString);
    poly.properties.uuid = record.get(0).properties.uuid;
    features.push(poly);

  });
  console.log('records', data.records.length);
  return features;
}

module.exports = {
  findAllHandler : findAllHandler,
  findByPointHandler : findByPointHandler,
  findByPolygonHandler : findByPolygonHandler,
}