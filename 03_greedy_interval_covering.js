/**
 * Intervallum lefedő probléma megoldása (Mohó algoritmus)
 * @param {Array} intervals - Az intervallumok listája [kezdet, vég] formátumban
 * @returns {Array} - A kiválasztott optimális időpontok (pontok) listája
 */
function solveIntervalCovering(intervals) {
    if (intervals.length === 0) return [];

    // 1. Lépés: Rendezés a jobb végpontok (Ti) szerint növekvő sorrendbe
    // Fontos: a mohó választás alapja a legkorábbi befejezés!
    const sortedIntervals = [...intervals].sort((a, b) => a[1] - b[1]);

    const coveringPoints = [];
    
    // Az első pontot a legelsőként végződő intervallum végpontjába tesszük
    let lastPoint = sortedIntervals[0][1];
    coveringPoints.push(lastPoint);

    // 2. Lépés: Iterálás a többi intervallumon
    for (let i = 1; i < sortedIntervals.length; i++) {
        const [start, end] = sortedIntervals[i];

        // Ha a jelenlegi intervallum már tartalmazza az utolsó lehelyezett pontot,
        // akkor ez az intervallum már le van fedve, ugorhatunk.
        if (start <= lastPoint && lastPoint <= end) {
            continue;
        }

        // Ha nincs lefedve, lehelyezünk egy új pontot a jelenlegi intervallum végpontjába
        lastPoint = end;
        coveringPoints.push(lastPoint);
    }

    return coveringPoints;
}

// --- Tesztelés az Influencer példával ---
const influencerSlots = [
    [0, 3], // Influencer 1
    [1, 4], // Influencer 2
    [2, 5], // Influencer 3
    [6, 8], // Influencer 4
    [7, 10], // Influencer 5
    [4, 7]  // Influencer 6
];

const result = solveIntervalCovering(influencerSlots);

console.log("Optimális időpontok a moderátor belépéséhez:", result);
