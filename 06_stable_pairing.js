function assignStudentsToUniversities(students, programs) {
    // 1. Előkészítés
    let freeStudents = [...students];
    let admissions = {}; // szak_nev -> [felvett_diakok_listaja]
    
    programs.forEach(p => admissions[p.name] = []);

    // 2. Az algoritmus futtatása
    while (freeStudents.length > 0) {
        let student = freeStudents.shift();
        
        // Ha a diáknak nincs több megjelölt szaka, kiesik
        if (student.prefs.length === 0) continue;

        // Következő megjelölt szak lekérése
        let targetProgramName = student.prefs.shift();
        let program = programs.find(p => p.name === targetProgramName);
        
        let currentAdmitted = admissions[targetProgramName];
        
        // Ideiglenesen felvesszük a diákot
        currentAdmitted.push(student);
        
        // Rangsoroljuk a jelentkezőket pontszám szerint (csökkenő)
        currentAdmitted.sort((a, b) => b.score - a.score);

        // Ha túlléptük a keretszámot, a leggyengébb kiesik
        if (currentAdmitted.length > program.capacity) {
            let rejectedStudent = currentAdmitted.pop();
            freeStudents.push(rejectedStudent);
        }
    }

    // 3. Eredmények formázása és ponthatárok számítása
    const finalResults = {};
    for (let progName in admissions) {
        let admitted = admissions[progName];
        finalResults[progName] = {
            students: admitted.map(s => `${s.name} (${s.score})`),
            minScore: admitted.length > 0 ? admitted[admitted.length - 1].score : "N/A"
        };
    }

    return finalResults;
}

// --- Adatok bevitele ---
const students = [
    { name: "Adél", score: 490, prefs: ["INFO", "GAZD"] },
    { name: "Balázs", score: 475, prefs: ["INFO", "GAZD"] },
    { name: "Csilla", score: 460, prefs: ["MŰV", "INFO"] },
    { name: "Dániel", score: 455, prefs: ["INFO", "GAZD"] },
    { name: "Eszter", score: 440, prefs: ["GAZD", "MŰV"] },
    { name: "Fanni", score: 430, prefs: ["MŰV", "GAZD"] },
    { name: "Gergő", score: 410, prefs: ["INFO", "GAZD", "MŰV"] },
    { name: "Hanna", score: 400, prefs: ["GAZD", "INFO"] },
    { name: "Imre", score: 390, prefs: ["MŰV"] },
    { name: "Janka", score: 380, prefs: ["INFO", "GAZD", "MŰV"] }
];

const programs = [
    { name: "INFO", capacity: 3 },
    { name: "GAZD", capacity: 3 },
    { name: "MŰV", capacity: 2 }
];

// --- Futtatás és kiíratás ---
const results = assignStudentsToUniversities(students, programs);

console.log("=== FELVÉTELI EREDMÉNYEK ===");
for (let prog in results) {
    console.log(`\nSzak: ${prog}`);
    console.log(`Ponthatár: ${results[prog].minScore}`);
    console.log(`Felvettek: ${results[prog].students.join(", ")}`);
}