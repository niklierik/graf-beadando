/**
 * Scarf-típusú lakáscsere algoritmus (TTC)
 * Tulajdonosok: A, B, C
 * Lakások: L1, L2, L3
 */
function stabilLakasCsere(adatok) {
    let piac = [...adatok];
    let eredmeny = [];

    while (piac.length > 0) {
        let mutatasok = new Map();
        
        // 1. Mindenki rámutat a kedvenc elérhető lakásának jelenlegi gazdájára
        piac.forEach(szemely => {
            let kedvencLakas = szemely.preferenciak.find(l => 
                piac.some(p => p.sajatLakas === l)
            );
            
            let gazda = piac.find(p => p.sajatLakas === kedvencLakas);
            mutatasok.set(szemely.nev, gazda.nev);
        });

        // 2. Kör keresése (Scarf-lemma alapján garantáltan van ilyen)
        let kor = [];
        let bejart = new Set();
        let aktualis = piac[0].nev;

        while (!bejart.has(aktualis)) {
            bejart.add(aktualis);
            aktualis = mutatasok.get(aktualis);
        }

        let startNode = aktualis;
        do {
            kor.push(aktualis);
            aktualis = mutatasok.get(aktualis);
        } while (aktualis !== startNode);

        // 3. A körben résztvevők megkapják az igényelt lakást és kilépnek
        kor.forEach(nev => {
            let szemely = piac.find(p => p.nev === nev);
            let kitolKapjaNev = mutatasok.get(nev);
            let kitolKapja = piac.find(p => p.nev === kitolKapjaNev);
            
            eredmeny.push({
                tulajdonos: szemely.nev,
                kapottLakas: kitolKapja.sajatLakas
            });
        });

        // Piac frissítése: a kör tagjai elmennek
        piac = piac.filter(p => !kor.includes(p.nev));
    }

    return eredmeny;
}

// --- Adatok az eredeti feladatleírás alapján ---
const adatok = [
    { nev: "A", sajatLakas: "L1", preferenciak: ["L2", "L3", "L1"] },
    { nev: "B", sajatLakas: "L2", preferenciak: ["L3", "L1", "L2"] },
    { nev: "C", sajatLakas: "L3", preferenciak: ["L1", "L2", "L3"] }
];

// --- Végrehajtás ---
const veglegesParositas = stabilLakasCsere(adatok);

console.log("=== SCARF-EGYENSÚLYI EREDMÉNY ===");
veglegesParositas.forEach(p => {
    console.log(`${p.tulajdonos} tulajdonos megkapta: ${p.kapottLakas}`);
});
