/**
 * Intervallum gráf színezése (Teremfoglalás optimalizálás)
 * @param {Array} events - Az események listája: { name: string, start: number, end: number }
 * @returns {Object} - A termek száma és a hozzájuk rendelt események
 */
function solveRoomAssignment(events) {
    if (events.length === 0) return { roomCount: 0, assignments: {} };

    // 1. Lépés: Rendezés a JOBB végpontok (befejezési idő) szerint CSÖKKENŐ sorrendbe
    // (A megadott elméleti stratégia alapján)
    const sortedEvents = [...events].sort((a, b) => b.end - a.end);

    const rooms = []; // Itt tároljuk az egyes termekbe osztott eseményeket

    // 2. Lépés: Iterálás az eseményeken
    for (let event of sortedEvents) {
        let assigned = false;

        // Megpróbáljuk betenni az eseményt egy már meglévő terembe
        for (let i = 0; i < rooms.length; i++) {
            // Ellenőrizzük, van-e ütközés a teremben lévő eseményekkel
            const hasConflict = rooms[i].some(e => 
                event.start < e.end && event.end > e.start
            );

            if (!hasConflict) {
                rooms[i].push(event);
                assigned = true;
                break;
            }
        }

        // Ha egyik létező terembe sem fér be, nyitunk egy újat
        if (!assigned) {
            rooms.push([event]);
        }
    }

    return {
        roomCount: rooms.length,
        schedule: rooms.map((room, index) => ({
            roomNumber: index + 1,
            events: room.map(e => `${e.name} (${e.start}-${e.end})`)
        }))
    };
}

// --- Adatok bevitele ---
const workshops = [
    { name: "A: AI alapok", start: 10, end: 12 },
    { name: "B: Web design", start: 11, end: 13 },
    { name: "C: Cybersecurity", start: 10.5, end: 11.5 },
    { name: "D: Cloud computing", start: 13.5, end: 15 },
    { name: "E: Data science", start: 13, end: 14.5 },
    { name: "F: Blockchain", start: 14.5, end: 16 }
];

const result = solveRoomAssignment(workshops);

// --- Eredmény kiíratása ---
console.log(`Minimálisan szükséges termek száma: ${result.roomCount}`);
console.log("Beosztás:");
result.schedule.forEach(r => {
    console.log(`  ${r.roomNumber}. Terem: ${r.events.join(", ")}`);
});