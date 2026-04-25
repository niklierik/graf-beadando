/**
 * Regiszterallokáció szimuláció (Kordális vs. Nem kordális)
 */
class RegisterAllocator {
    constructor(adjacencies) {
        this.graph = adjacencies;
        this.nodes = Object.keys(adjacencies);
    }

    // Egyszerű mohó színezés
    colorGraph(order = this.nodes) {
        const result = {};
        
        order.forEach(node => {
            const neighborColors = new Set(
                this.graph[node]
                    .map(neighbor => result[neighbor])
                    .filter(color => color !== undefined)
            );

            // Megkeressük a legkisebb elérhető színt (regisztert)
            let color = 0;
            while (neighborColors.has(color)) {
                color++;
            }
            result[node] = color;
        });

        return result;
    }
}

// --- 1. ESET: Tiltott részgráfot tartalmazó gráf (C4 kör: V1-V2-V3-V4-V1) ---
const forbiddenGraph = {
    'V1': ['V2', 'V4'],
    'V2': ['V1', 'V3'],
    'V3': ['V2', 'V4'],
    'V4': ['V3', 'V1']
};

// --- 2. ESET: Kordális gráf (Ugyanez, de behúztunk egy V1-V3 húrt) ---
const chordalGraph = {
    'V1': ['V2', 'V4', 'V3'], // +V3 húr
    'V2': ['V1', 'V3'],
    'V3': ['V2', 'V4', 'V1'], // +V1 húr
    'V4': ['V3', 'V1']
};

const allocatorForbidden = new RegisterAllocator(forbiddenGraph);
const allocatorChordal = new RegisterAllocator(chordalGraph);

// Színezés (Regiszterkiosztás)
const res1 = allocatorForbidden.colorGraph();
const res2 = allocatorChordal.colorGraph(['V4', 'V2', 'V3', 'V1']); // PEO sorrend

console.log("=== 1. Tiltott C4 kör (Nem kordális) ===");
console.log("Regiszter kiosztás:", res1);
console.log("Szükséges regiszterek száma:", Math.max(...Object.values(res1)) + 1);

console.log("\n=== 2. Triangulált (Kordális) gráf ===");
console.log("Regiszter kiosztás:", res2);
console.log("Szükséges regiszterek száma:", Math.max(...Object.values(res2)) + 1);