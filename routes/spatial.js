const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const {
    add,
    findByPolygon,
    findByPoint,
    findAll
} = require('../js/neo4j/neo4j')

router.post('/add', function (req, res) {

    add(req.body, uuidv1(), req.body.properties.email)
        .then(() => res.end());
});

const handleFeatureResponse = (res, features) => {
    let featureCollection = {
        type: 'FeatureCollection',
        features: features
    }
    res.send(featureCollection);
    res.end();
}

router.post('/findByPolygon', function (req, res) {

    findByPolygon(req.body)
        .then(features => handleFeatureResponse(res, features))
});

router.get('/findByPoint/:lng/:lat', function (req, res) {

    findByPoint(req.params.lng, req.params.lat)
        .then(features => handleFeatureResponse(res, features))
});

router.get('/findAll', function (req, res) {
    
    findAll()
        .then(features => handleFeatureResponse(res, features))
});

module.exports = router;