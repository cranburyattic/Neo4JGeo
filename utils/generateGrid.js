const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'test'));



session = driver.session();
const cypher1 = 'CREATE (:Anchor:Longitude { position : {position}})';
const cypher2 = 'CREATE (:Anchor:Latitude { position : {position}})';

(async function loop() {
  for(i = - 180; i <= 180; i = i + 0.2)  {
      await  session.run(cypher1, { position : parseFloat(i.toFixed(1))});
  }
  console.log('DONE LNG');
  for(i = - 90; i <= 90; i = i + 0.2)  {
    await  session.run(cypher2, { position : parseFloat(i.toFixed(1))});
  }
  console.log('DONE LAT');
  session.close();
  driver.close();
})();