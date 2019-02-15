const getRootNodeForPoint = (lat, lng, factor) => {
    return {
        lat : _round(lat, factor),
        lng : _round(lng, factor)  
    }
}

const generateElasticBoundingBox = (w,n,e,s) => {
    let result = [];
    if(Math.sign(w) === -1) {
        result[0] = Number(_roundNegative(w, true));
    } else {
        result[0] = Number(_roundPositive(w, false));
    }

    if(Math.sign(n) === -1) {
        result[1] = Number(_roundNegative(n, false));
    } else {
        result[1] =Number(_roundPositive(n, true));
    }

    if(Math.sign(e) === -1) {
        result[2] =Number(_roundNegative(e, false));
    } else {
        result[2] =Number(_roundPositive(e, true));
    }

    if(Math.sign(s) === -1) {
        result[3] =Number(_roundNegative(s, true));
    } else {
        result[3] =Number(_roundPositive(s, false));
    }
    return result;
}


const _roundNegative = (val, roundUp) => {
    if(roundUp) {
      return(val - (0.2 + (val % 0.2))).toFixed(1);
    } else {
      return (val - (val % 0.2)).toFixed(1);
    }
  }
  
  const _roundPositive = (val, roundUp) => {
    if(roundUp) {
      return (val + (0.2 - (val % 0.2))).toFixed(1);
    } else {
      return (val - (val % 0.2)).toFixed(1);
    }
  }


const _round = (val, factor) => {
    if(Math.sign(val) === -1) {
        return Number((val - (factor + (val % factor))).toFixed(1))  
    } else {
        return Number((val - (val % factor)).toFixed(1))
    }
}

const getRootNodeForPointNW = (lat, lng, factor) => {
    return {
        lat : _roundUP(lat, factor),
        lng : _round(lng, factor)  
    }
}

const getRootNodeForPointNE = (lat, lng, factor) => {
    return {
        lat : _roundUP(lat, factor),
        lng : _roundUP(lng, factor)  
    }
}

const getRootNodeForPointSE = (lat, lng, factor) => {
    return {
        lat : _round(lat, factor),
        lng : _roundUP(lng, factor)  
    }
}

const _roundUP= (val, factor) => {
    if(Math.sign(val) === -1) {
        return Number((val - (val % factor)).toFixed(1))
    } else {
        return Number((val + (factor - (val % factor))).toFixed(1))
    }
}

module.exports = {
    getRootNodeForPoint : getRootNodeForPoint,
    getRootNodeForPointNW : getRootNodeForPointNW,
    getRootNodeForPointNE : getRootNodeForPointNE,
    getRootNodeForPointSE : getRootNodeForPointSE,
    generateElasticBoundingBox : generateElasticBoundingBox
}


