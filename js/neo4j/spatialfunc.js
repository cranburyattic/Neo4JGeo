const turfHelper = require('@turf/helpers');
const bbox = require('@turf/bbox').default;
const booleanDisjoint = require('@turf/boolean-disjoint').default;
const {generateElasticBoundingBox} = require('./rootnode');

const convertStringToPolygon = (polygonString) => {

    const arr = polygonString.split(',');
    let points=[]
    for(i = 0; i < arr.length;) {
        points.push([parseFloat(arr[i]), parseFloat(arr[i+1])]);
        i = i + 2;
    }
    return turfHelper.polygon([points]);
}

const getElasticBoundingBox = (polygon) => {

    const bb = bbox(polygon);

    const w = bb[0]
    const s = bb[1]
    const e = bb[2]
    const n = bb[3]

    let elasticBoundingBox  = generateElasticBoundingBox(w,n,e,s);
    
    let xPoints = [];
    let max = Math.max(elasticBoundingBox[0],elasticBoundingBox[2]);
    let min = Math.min(elasticBoundingBox[0],elasticBoundingBox[2]);
    for(let x = min; x <= max;) {
        xPoints.push(Number(x.toFixed(1)));
        x = x + 0.2
    }

    let yPoints = [];
    max = Math.max(elasticBoundingBox[1],elasticBoundingBox[3]);
    min = Math.min(elasticBoundingBox[1],elasticBoundingBox[3]);
    for(let y = min; y <= max;) {
        yPoints.push(Number(y.toFixed(1)));
        y = y + 0.2
    }

    return [xPoints,yPoints];
}

const getNodeRootForPoint = (x,y) => {
    const nodePointX = (x / 0.2) * 0.2;
    const nodePointY = (y / 0.2) * 0.2;
    return [nodePointX, nodePointY];
}

const generateNodeRootPoints = (polygon, factor) => {

    const bb = bbox(polygon);

    const lngMin = bb[0]
    const latMin = bb[1]
    const lngMax = bb[2]
    const latMax = bb[3]

    let min = rootNode.getRootNodeForPoint(latMin, lngMin, factor);
    let max = rootNode.getRootNodeForPoint(latMax, lngMax, factor);

    const swX = min.lng;
    const swY = min.lat;
    const seX = max.lng
    const nwY = max.lat


    let nodeRootPoints = [];
    for(let x = swX; x <= seX + factor;) {
        for(let y = swY; y <= nwY + factor;) {
            x = Number(x.toFixed(1));
            y = Number(y.toFixed(1));
            if(!booleanDisjoint(generatePoly(x, y, factor), polygon)) {
                nodeRootPoints.push([x,y])
            }
            y = y + factor;
        }
        x = x + factor;
    }

    return nodeRootPoints;
}

const generatePoly = (x, y, factor) => turfHelper.polygon([[[x, y],[x + factor, y],[x + factor, y +factor],[x, y + factor],[x,y]]]);

module.exports = {
    generateNodeRootPoints : generateNodeRootPoints,
    generatePoly : generatePoly,
    getNodeRootForPoint : getNodeRootForPoint,
    convertStringToPolygon : convertStringToPolygon,
    getElasticBoundingBox : getElasticBoundingBox,
}