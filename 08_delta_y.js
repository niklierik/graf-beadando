/**
 * Ellenállás-hálózat redukáló (Delta-Y fókusszal)
 */
class HalozatRedukalo {
    // Delta-Y transzformáció: R1, R2, R3 (delta élek) -> Ry (csillag ellenállás)
    static deltaToWye(r1, r2, r3) {
        const sum = r1 + r2 + r3;
        return {
            ra: (r1 * r2) / sum,
            rb: (r1 * r3) / sum,
            rc: (r2 * r3) / sum
        };
    }

    // R3: Párhuzamos redukció
    static parhuzamos(r1, r2) {
        return (r1 * r2) / (r1 + r2);
    }

    // R2: Soros redukció
    static soros(r1, r2) {
        return r1 + r2;
    }
}

// --- A konkrét feladat megoldása ---

console.log("--- Hídkapcsolás redukciója ---");

const R = 120; // Minden ellenállás 120 Ohm

// 1. Lépés: Bal oldali Delta (A-F-L csúcsok) -> Y transzformáció
// Mivel minden R egyenlő, az új ágak is egyenlőek lesznek
const yAgak = HalozatRedukalo.deltaToWye(R, R, R);
console.log(`1. Delta-Y utáni új ágak: ${yAgak.ra} Ω`); 

// 2. Lépés: Soros redukció az ágakban (P-F-B és P-L-B útvonalak)
// Az Y két ága sorba kerül a maradék két eredeti ellenállással
const felsoAg = HalozatRedukalo.soros(yAgak.rb, R);
const alsoAg = HalozatRedukalo.soros(yAgak.rc, R);
console.log(`2. Soros ágak értéke: ${felsoAg} Ω`);

// 3. Lépés: Párhuzamos redukció a két ág között
const parhuzamosEredo = HalozatRedukalo.parhuzamos(felsoAg, alsoAg);
console.log(`3. Párhuzamos rész eredője: ${parhuzamosEredo} Ω`);

// 4. Lépés: Utolsó soros elem (A ponttól induló Y szár)
const vegsoEredo = HalozatRedukalo.soros(yAgak.ra, parhuzamosEredo);

console.log("\n--------------------------------");
console.log(`VÉGEREDMÉNY: ${vegsoEredo} Ω`);
console.log("--------------------------------");