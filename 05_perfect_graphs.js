/**
 * Frekvenciakiosztás szimulálása perfekt gráfon (Mohó színezés)
 */
function assignFrequencies(devices, interferenceEdges) {
    const adj = new Map();
    devices.forEach(d => adj.set(d, []));
    
    // Gráf felépítése (szomszédsági lista)
    interferenceEdges.forEach(([u, v]) => {
        adj.get(u).push(v);
        adj.get(v).push(u);
    });

    const assignments = {}; // { eszköz: csatorna_száma }

    // Mohó színezés
    devices.forEach(device => {
        const neighborChannels = new Set();
        
        // Megnézzük a szomszédok (ütköző eszközök) csatornáit
        adj.get(device).forEach(neighbor => {
            if (assignments[neighbor] !== undefined) {
                neighborChannels.add(assignments[neighbor]);
            }
        });

        // Megkeressük a legkisebb szabad csatornát (1-től indulva)
        let channel = 1;
        while (neighborChannels.has(channel)) {
            channel++;
        }
        
        assignments[device] = channel;
    });

    // Kromatikus szám meghatározása
    const chromaticNumber = Math.max(...Object.values(assignments));

    return {
        assignments,
        chromaticNumber
    };
}

// --- Adatok (Szenzorok és interferenciák) ---
const sensors = ["S1", "S2", "S3", "S4", "S5", "S6"];
const interference = [
    ["S1", "S2"], ["S1", "S3"], ["S1", "S4"],
    ["S2", "S3"], ["S2", "S4"],
    ["S3", "S4"], ["S3", "S5"],
    ["S4", "S5"],
    ["S5", "S6"]
];

const result = assignFrequencies(sensors, interference);

console.log(`Minimálisan szükséges csatornák száma: ${result.chromaticNumber}`);
console.log("Kiosztás eszközönként:", result.assignments);