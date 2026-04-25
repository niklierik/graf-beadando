/**
 * Maximális független halmaz keresése (Ütemezés optimalizálás)
 * @param {Array} jobs - { name: string, start: number, end: number }
 * @returns {Array} - A kiválasztott, egymással nem ütköző munkák listája
 */
function solveMaxIndependentSet(jobs) {
    if (jobs.length === 0) return [];

    // 1. Lépés: Rendezés a JOBB végpontok szerint NÖVEKVŐ sorrendbe
    const sortedJobs = [...jobs].sort((a, b) => a.end - b.end);

    const selectedJobs = [];
    let lastFinishTime = -Infinity;

    // 2. Lépés: Mohó kiválasztás
    for (let job of sortedJobs) {
        // Ha a munka kezdete nem korábbi, mint az utolsó befejezése (nincs átfedés)
        if (job.start >= lastFinishTime) {
            selectedJobs.push(job);
            lastFinishTime = job.end;
        }
    }

    return selectedJobs;
}

const munkak = [
    { name: "P1: Reklám", start: 8, end: 11 },
    { name: "P2: Interjú", start: 9, end: 10.5 },
    { name: "P3: Zenei klip", start: 10, end: 12 },
    { name: "P4: Esküvő", start: 11.5, end: 14 },
    { name: "P5: Social media", start: 13, end: 15 },
    { name: "P6: Termékbemutató", start: 14.5, end: 17 },
    { name: "P7: Vlog", start: 16, end: 18 }
];

const megoldas = solveMaxIndependentSet(munkak);

console.log("Maximálisan elvégezhető munkák száma:", megoldas.length);
console.log("Kiválasztott projektek:", megoldas.map(m => m.name).join(", "));