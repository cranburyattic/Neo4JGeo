module.exports = {
  findAllCypher: 'MATCH (p:Polygon) return p',
  findByPolygonCypher : "MATCH (lng:Longitude)-[:LNG]->(p:Polygon)-[:LAT]->(lat:Latitude) WHERE lng.position IN {xValues} AND lat.position IN {yValues} RETURN DISTINCT p",
  findByPointCypher: 'MATCH (lng:Longitude)-[:LNG]->(p)-[:LAT]->(lat:Latitude) \
    WHERE (lng.position IN {lngs} AND lat.position IN {lats}) \
    RETURN DISTINCT p',
  polyStringCypher: 'MERGE (p:Polygon  \
    { uuid : {uuid}, area : {area}, pointString : {pointString}, \
    bbxMin : {bbxMin},  bbyMin : {bbyMin}, bbxMax : {bbxMax},  bbyMax : {bbyMax} }) return p',
  userStringCypher: 'MERGE (u:User { email : {email}}) WITH u MATCH (p:Polygon {uuid : {uuid}}) \
    CREATE (u)-[:OWNS]->(p) RETURN u,p',
  polygonToLat : "MATCH (l:Latitude), (p:Polygon { uuid : {uuid}}) WHERE l.position IN {yValues} CREATE (p)-[:LAT]->(l) return p, l",
  polygonToLng : "MATCH (l:Longitude), (p:Polygon { uuid : {uuid}}) WHERE l.position IN {xValues} CREATE (l)-[:LNG]->(p) return p, l"
}