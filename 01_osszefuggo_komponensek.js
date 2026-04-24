/**
 * BFS alapú összefüggőségi vizsgálat vízhálózathoz
 */

// 1. Csúcsok definiálása (indexek és nevek összerendelése)
const nodes = [
  "V1",
  "F1",
  "K1",
  "H",
  "V2",
  "B1",
  "T1",
  "SZ1",
  "I1",
  "I2",
  "L1",
  "L2",
  "U",
];
const nodeToIndex = Object.fromEntries(nodes.map((name, i) => [name, i]));

// 2. Szomszédsági mátrix inicializálása (13x13-as nulla mátrix)
const size = nodes.length;
const matrix = Array.from({ length: size }, () => Array(size).fill(0));

// 3. Élek hozzáadása (mivel irányítatlan, mindkét irányba 1-est teszünk)
function addEdge(u, v) {
  const i = nodeToIndex[u];
  const j = nodeToIndex[v];
  matrix[i][j] = 1;
  matrix[j][i] = 1;
}

// Élek definiálása a gráf alapján
addEdge("V1", "F1");
addEdge("F1", "K1");
addEdge("K1", "H");
addEdge("F1", "H");
addEdge("V2", "B1");
addEdge("V2", "T1");
addEdge("B1", "SZ1");
addEdge("B1", "T1");
addEdge("T1", "I1");
addEdge("SZ1", "I1");
addEdge("T1", "I2");
addEdge("I1", "I2");
addEdge("SZ1", "I2");
addEdge("I2", "L1");
addEdge("L1", "L2");

/**
 * BFS algoritmus egy adott forrásból
 */
function bfs(startNodeName, visitedGlobal) {
  const startIdx = nodeToIndex[startNodeName];
  if (visitedGlobal.has(startIdx)) return null;

  const queue = [startIdx];
  const component = new Set();
  const visitedLocal = new Set();

  visitedLocal.add(startIdx);
  visitedGlobal.add(startIdx);

  while (queue.length > 0) {
    const u = queue.shift();
    component.add(nodes[u]);

    // Szomszédok keresése a mátrix adott sorában
    for (let v = 0; v < size; v++) {
      if (matrix[u][v] === 1 && !visitedLocal.has(v)) {
        visitedLocal.add(v);
        visitedGlobal.add(v);
        queue.push(v);
      }
    }
  }
  return Array.from(component);
}

// 4. Futtatás a forrásokra és hiányelemzés
const visitedGlobal = new Set();

const v1Körzet = bfs("V1", visitedGlobal);
const v2Körzet = bfs("V2", visitedGlobal);

// Maradék (ellátatlan) pontok keresése
const ellatatlan = nodes.filter((_, i) => !visitedGlobal.has(i));

// Eredmények kiírása
console.log("V1 ellátási körzete:", v1Körzet);
console.log("V2 ellátási körzete:", v2Körzet);
console.log("Ellátatlan pontok:", ellatatlan);
