/**
 * Háromszögezett gráf ellenőrző és javító algoritmus
 */
class ChordalGraphSolver {
    constructor(vertices, edges) {
        this.adj = new Map();
        vertices.forEach(v => this.adj.set(v, new Set()));
        edges.forEach(([u, v]) => {
            this.adj.get(u).add(v);
            this.adj.get(v).add(u);
        });
    }

    // Ellenőrzi, hogy egy adott pont szimpliciális-e
    isSimplicial(v, currentAdj) {
        const neighbors = Array.from(currentAdj.get(v));
        for (let i = 0; i < neighbors.length; i++) {
            for (let j = i + 1; j < neighbors.length; j++) {
                if (!currentAdj.get(neighbors[i]).has(neighbors[j])) {
                    return { simplicial: false, missingEdge: [neighbors[i], neighbors[j]] };
                }
            }
        }
        return { simplicial: true };
    }

    // Megkeresi a Perfekt Eliminációs Sémát (PES) vagy a hibát
    analyze() {
        let tempAdj = new Map();
        this.adj.forEach((neighbors, v) => tempAdj.set(v, new Set(neighbors)));
        
        const nodes = Array.from(tempAdj.keys());
        const pes = [];
        const missingEdges = [];

        while (nodes.length > 0) {
            let found = false;
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const check = this.isSimplicial(node, tempAdj);
                
                if (check.simplicial) {
                    pes.push(node);
                    // Eltávolítjuk a pontot és a hozzá tartozó éleket
                    const neighbors = tempAdj.get(node);
                    neighbors.forEach(n => tempAdj.get(n).delete(node));
                    tempAdj.delete(node);
                    nodes.splice(i, 1);
                    found = true;
                    break;
                } else {
                    missingEdges.push(check.missingEdge);
                }
            }

            if (!found) {
                return {
                    isChordal: false,
                    suggestedChord: missingEdges[0],
                    message: "A gráf nem háromszögezett. Feszített kört találtam."
                };
            }
        }

        return {
            isChordal: true,
            pes: pes,
            message: "A gráf háromszögezett (Húrgráf)."
        };
    }
}

// --- Tesztelés a diagnosztikai feladattal ---

const vertices = ['L', 'K', 'T', 'N'];
const edges = [
    ['L', 'K'], ['K', 'T'], ['T', 'N'], ['N', 'L']
];

const solver = new ChordalGraphSolver(vertices, edges);
const result = solver.analyze();

console.log("Eredmény:", result.message);
if (!result.isChordal) {
    console.log(`Javasolt húr a háromszögezéshez: ${result.suggestedChord.join(' - ')}`);
} else {
    console.log("Perfekt Eliminációs Séma (PES):", result.pes.join(' -> '));
}

// Kimenet várhatóan: 
// Eredmény: A gráf nem háromszögezett. Feszített kört találtam.
// Javasolt húr a háromszögezéshez: L - T (vagy K - N)