# Gráfelméleti algoritmusok

## Alapfogalmak és definíciók

Egy $G$ gráfot a $G = (V, E, I)$ rendezett hármassal definiálunk:

- **$V(G)$**: csúcsok (pontok) halmaza.
- **$E(G)$**: élek halmaza.
- **$I(G)$**: incidencia függvény, amely minden élhez hozzárendeli annak végpontjait (egy- vagy kételemű halmaz).

A modell megengedi a **hurokélek** (önmagukba visszatérő élek) és a **többszörös élek** használatát.

### Csúcsok fokszáma

A $v$ csúcs **fokszáma** ($d(v)$) az rá illeszkedő élek száma.

- **Hurokél**: két egységgel növeli a fokszámot.
- **Irányított gráf**: megkülönböztetünk **befutó** ($d^-(v)$) és **kifutó** ($d^+(v)$) fokszámot. A teljes fokszám: $d(v) = d^-(v) + d^+(v)$.

### Séta, út és kör

- **Séta**: csúcsok és élek tetszőleges sorozata, ahol az egymást követő elemek illeszkednek.
- **Út**: olyan séta, amelyben minden csúcs különböző (nincs benne ismétlődés).
- **Kör**: olyan zárt séta, amelyben csak az első és utolsó csúcs azonos, a köztes csúcsok különbözőek.

## Fák

A fák a legegyszerűbb összefüggő struktúrák a gráfelméletben.

### Definíció és ekvivalens jellemzések

Egy gráf **fa**, ha összefüggő és körmentes. Egy $n$ csúcsú $G$ gráf esetén az alábbi állítások ekvivalensek:

- $G$ összefüggő és körmentes.
- $G$ **minimálisan összefüggő**: összefüggő, de bármely élét elhagyva szétesik.
- $G$ **maximálisan körmentes**: körmentes, de bármely új éllel bővítve kör keletkezik benne.
- $G$ összefüggő és $n-1$ éle van.
- $G$ körmentes és $n-1$ éle van.

### Strukturális tulajdonságok

- **Egyértelműség**: Bármely két csúcs között pontosan egy út vezet.
- **Levelek**: Minden legalább kétpontú fának van legalább két **levele** (elsőfokú csúcsa). Ez teszi lehetővé a fákra vonatkozó tételek teljes indukcióval történő bizonyítását.

### Feszítőfák és gyökeres fák

- **Feszítőfa**: A $G$ gráf olyan részgráfja, amely fa és tartalmazza $G$ összes csúcsát.
- **Gyökeres fa**: Olyan fa, amelyben kijelölünk egy kitüntetett $r$ csúcsot (**gyökér**). A gyökér kijelölése hierarchiát és irányítást ad a fának: az élek a gyökértől távolodó irányt kapnak.

## Gráfok összefüggősége és komponensei

Ez a fejezet az elérhetőség különböző szintjeit és azok algoritmusait tárgyalja.

### Elméleti alapvetések

#### Irányítatlan gráfok összefüggősége

Egy $G$ gráf **összefüggő**, ha tetszőleges $x, y \in V(G)$ csúcspár között létezik út.
Az $x \sim y$ reláció (van közöttük út) egy **ekvivalenciareláció**. Az általa meghatározott osztályokat a gráf **komponenseinek** nevezzük.

#### Irányított gráfok összefüggősége

1. **Gyenge összefüggőség:** Az irányított gráf gyengén összefüggő, ha az élek irányítását elhagyva a kapott alapgráf összefüggő.
2. **Erős összefüggőség:** A gráf erősen összefüggő, ha bármely két $x, y$ pontja között létezik **irányított út** mindkét irányban ($x \to y$ és $y \to x$).

Az oda-vissza elérhetőség ($x \equiv y$) osztályai az **erősen összefüggő komponensek (SCC)**.

### Algoritmusok a gyenge összefüggőség vizsgálatára

A vizsgálat során az élek irányát figyelmen kívül hagyjuk.

#### Szélességi keresés (BFS) alapú megközelítés

```text
ALGORITMUS GyengeÖsszefüggőségBFS(G):
    Látogatott = [Hamis, ..., Hamis]
    Várólista = Queue()
    Látogatott[s] = Igaz; Várólista.betesz(s)
    Számláló = 1

    AMÍG Várólista NEM üres:
        u = Várólista.kivesz()
        MINDEN v szomszédra (iránytól függetlenül):
            HA Látogatott[v] == Hamis:
                Látogatott[v] = Igaz; Várólista.betesz(v)
                Számláló++
    VISSZAAD (Számláló == n)
```

#### Mélységi keresés (DFS) alapú megközelítés

```text
ALGORITMUS GyengeÖsszefüggőségDFS(G):
    Látogatott = [Hamis, ..., Hamis]; Számláló = 0
    ELJÁRÁS Bejár(u):
        Látogatott[u] = Igaz; Számláló++
        MINDEN v szomszédra (iránytól függetlenül):
            HA Látogatott[v] == Hamis: Bejár(v)
    Bejár(s); VISSZAAD (Számláló == n)
```

### Erős összefüggőség: Tarjan-algoritmus

A Tarjan-algoritmus egyetlen DFS bejárás alatt azonosítja az összes SCC-t. Két értéket követ minden csúcsnál:

- **Index:** Felfedezési sorrend.
- **Lowlink:** A legkisebb indexű csúcs, amely az adott pontból (visszafelé mutató élen is) elérhető.

#### Pszeudokód

```text
ALGORITMUS TarjanSCC(G):
    Számláló = 0; Verem = []; Eredmény = []
    MINDEN v: v.index = -1, v.veremben_van = Hamis

    ELJÁRÁS ErősBejár(u):
        u.index = u.lowlink = Számláló++
        Verem.push(u); u.veremben_van = Igaz
        MINDEN (u, v) ∈ E:
            HA v.index == -1:
                ErősBejár(v)
                u.lowlink = MIN(u.lowlink, v.lowlink)
            ELÁGAZÁS HA v.veremben_van:
                u.lowlink = MIN(u.lowlink, v.index)
        HA u.lowlink == u.index:
            ÚjSCC = []
            CIKLUS:
                w = Verem.pop(); w.veremben_van = Hamis
                ÚjSCC.add(w)
            AMÍG w != u
            Eredmény.add(ÚjSCC)

    MINDEN v: HA v.index == -1: ErősBejár(v)
    VISSZAAD Eredmény
```

#### Komplexitás

- **Időigény:** $O(V + E)$.
- **Tárigény:** $O(V)$.

### Alkalmazási példa: Infrastrukturális hálózat összefüggőségének vizsgálata

#### Feladat:

Az alábbi gráfon egy város vízeloszlását látjuk. Kettő forrásunk van, V1 és V2 víztározók.

A feladat, hogy meghatározzuk a város mely pontjaiba jut el a V1 és a V2 víztározókból víz, illetve, van-e olyan pont, ahova nem jut el.

#### Példa gráf:

```mermaid
graph TD
    V1((V1: Víztározó 1))  F1[F1: Főelosztó]
    F1  K1[K1: Központi csomópont]
    K1  H[H: Kórház]
    F1  H

    V2((V2: Víztározó 2))  B1[B1: Betápláló pont]
    V2  T1[T1: Víztorony]

    B1  SZ1[SZ1: Szivattyúállomás]
    B1  T1

    SZ1  I1[I1: Ipari Park]
    T1  I1

    T1  I2[I2: Raktárbázis]

    I1  I2
    SZ1  I2

    I2  L1[L1: Lakópark]
    L1  L2[L2: Társasházak]

    %% Szigetelt pont
    U[U: Üzemanyagtöltő]
```

#### A megoldás menete

(Gyengén) Összefüggő komponenseket fogunk keresni, V1, V2 csúcsokból kiindulva, illetve nyilvántartjuk, mely csúcsokat nem láttuk még egy halmazban. Az algoritmus futásának végén, ezen halmaz elemei fogják megmondani, mely csúcsok nem kapnak jelenleg sehonnan vizet.

Meglátogatlan csúcsok:

```
{ V1, V2, U, F1, B1, K1, T1, SZ1, H, I1, I2, L1, L2 }
```

1. Bejárás: V1 víztározó hatóköre

| Iteráció | Aktuális csúcs ($u$) | Open halmaz (Queue) | Closed halmaz (Látogatott) | Esemény / Észrevétel                      |
| :------- | :------------------- | :------------------ | :------------------------- | :---------------------------------------- |
| **0.**   | -                    | `[V1]`              | `{V1}`                     | V1-ből indulunk.                          |
| **1.**   | **V1**               | `[F1]`              | `{V1, F1}`                 | F1 elérése.                               |
| **2.**   | **F1**               | `[K1, H]`           | `{V1, F1, K1, H}`          | K1 és H felfedezése.                      |
| **3.**   | **K1**               | `[H]`               | `{V1, F1, K1, H}`          | H már a sorban van, nem adjuk hozzá újra. |
| **4.**   | **H**                | `[]`                | `{V1, F1, K1, H}`          | Sor üres. **V1 körzete: {V1, F1, K1, H}** |

Meglátogatlan csúcsok:

```
{ V2, U, B1, T1, SZ1, I1, I2, L1, L2 }
```

2. Bejárás: A V2 víztározó ellátási körzete

| Iteráció | Aktuális csúcs ($u$) | Open halmaz (Queue) | Closed halmaz (Látogatott)  | Esemény / Észrevétel                      |
| :------- | :------------------- | :------------------ | :-------------------------- | :---------------------------------------- |
| **0.**   | -                    | `[V2]`              | `{V2}`                      | Új mérés indítása a V2 forrásból.         |
| **1.**   | **V2**               | `[B1, T1]`          | `{V2, B1, T1}`              | B1 és T1 bekerül a sorba.                 |
| **2.**   | **B1**               | `[T1, SZ1]`         | `{V2, B1, T1, SZ1}`         | T1 már sorban van, SZ1 új elem.           |
| **3.**   | **T1**               | `[SZ1, I1, I2]`     | `{V2, B1, T1, SZ1, I1, I2}` | T1-ből I1 és I2 is elérhető.              |
| **4.**   | **SZ1**              | `[I1, I2]`          | `{V2, B1, T1, SZ1, I1, I2}` | I1 és I2 már ismertek, nincs változás.    |
| **5.**   | **I1**               | `[I2]`              | `{V2, B1, T1, SZ1, I1, I2}` | Minden szomszéd (SZ1, T1, I2) látogatott. |
| **6.**   | **I2**               | `[L1]`              | `{V2..I2, L1}`              | Az I2 ponton keresztül elérjük az L1-et.  |
| **7.**   | **L1**               | `[L2]`              | `{V2..L1, L2}`              | L2 (Társasházak) bekerül a sorba.         |
| **8.**   | **L2**               | `[]`                | `{V2..L2}`                  | A sor kiürült. **V2 körzete kész.**       |

- Konklúzió:

  - V1 által ellátott pontok: { V1, F1, K1, H }
  - V2 által ellátott pontok: { V2, B1, T1, SZ1, I1, I2, L1, L2 }
  - Víz nélküli pontok: { U }

#### Kód

A forráskód külön megtalálható [itt](01_osszefuggo_komponensek.js)

JS kód, amely BFS-sel keres (gyengén) összefüggő komponenseket.

```js
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

const v1Area = bfs("V1", visitedGlobal);
const v2Area = bfs("V2", visitedGlobal);

// Maradék (ellátatlan) pontok keresése
const notSupplied = nodes.filter((_, i) => !visitedGlobal.has(i));

// Eredmények kiírása
console.log("V1 ellátási körzete:", v1Area);
console.log("V2 ellátási körzete:", v2Area);
console.log("Ellátatlan pontok:", notSupplied);
```

```log
V1 ellátási körzete: [ 'V1', 'F1', 'K1', 'H' ]
V2 ellátási körzete: [
  'V2',  'B1', 'T1',
  'SZ1', 'I1', 'I2',
  'L1',  'L2'
]
Ellátatlan pontok: [ 'U' ]
```

## Totálisan unimoduláris (TU) mátrixok

A hálózati problémák hatékony megoldhatósága a **totálisan unimoduláris (TU)** mátrixok tulajdonságain alapul. Ez teszi lehetővé, hogy egészértékű programozási feladatokat lineáris programozási (LP) módszerekkel oldjunk meg.

### Definíció és alapvető tulajdonságok

Egy $A$ mátrix **totálisan unimoduláris**, ha minden négyzetes részmátrixának determinánsa a $\{0, 1, -1\}$ halmaz eleme.

- **Következmény:** Egy TU mátrix elemei kizárólag $0, 1$ vagy $-1$ értékek lehetnek (mivel az $1 \times 1$-es részmátrixok maguk az elemek).

### A Hoffman–Kruskal tétel

Ha az $Ax \leq b$ feltételrendszerben az $A$ mátrix **TU** és a $b$ vektor **egész számokból** áll, akkor a lehetséges megoldások poliéderének **összes csúcspontja** egész koordinátájú.

**Gyakorlati jelentőség:**
Az egészértékű programozási (IP) feladatok LP-relaxációja (szimplex algoritmus) automatikusan egész számú optimális megoldást ad, mivel az algoritmus a poliéder csúcspontjain halad keresztül. Ezzel elkerülhető a kerekítés és a bonyolultabb IP algoritmusok használata.

### Gráfelméleti vonatkozások

A hálózati modellek azért kezelhetők LP-ként, mert a gráfok illeszkedési mátrixai TU szerkezetűek:

1. **Irányított gráfok illeszkedési mátrixa:** Mindig TU. Minden oszlopban pontosan egy $+1$ (végpont) és egy $-1$ (kezdőpont) szerepel, a többi elem nulla.
2. **Páros gráfok illeszkedési mátrixa:** Szintén TU. Ez biztosítja például a maximális párosítási feladatok hatékony megoldhatóságát.

### A TU tulajdonság felismerése (Elegendő feltétel)

Egy $0, \pm 1$ elemekből álló mátrix biztosan **TU**, ha:

- Minden oszlopában legfeljebb egy $+1$ és legfeljebb egy $-1$ szerepel.

_(Megjegyzés: Ez a feltétel fennáll minden irányított folyamprobléma illeszkedési mátrixára.)_

### Feladat: Gyártási ütemezés és készletelosztás (Négyzetes TU mátrix)

**A szituáció:**
Egy gyártósoron három egymást követő munkaállomás (M1, M2, M3) napi alapanyag-igényét kell kielégíteni. Három különböző típusú ellátási csomag (C1, C2, C3) áll rendelkezésre. Az $A$ mátrix sorai az állomások ellátási kényszereit, oszlopai a csomagok hatókörét reprezentálják:

- A **C1** csomag az M1 munkaállomáshoz szükséges.
- A **C2** csomag az M1 és M2 munkaállomásokhoz egyaránt felhasználható.
- A **C3** csomag az M2 és M3 munkaállomások igényeit is kielégíti.

A feladatot leíró négyzetes együtthathatómátrix ($A$):

$$
A = \begin{pmatrix}
1 & 1 & 0 \\
0 & 1 & 1 \\
0 & 0 & 1
\end{pmatrix}
$$

---

#### A totálisan unimoduláris tulajdonság igazolása

A definíció alapján egy mátrix totálisan unimoduláris (TU), ha minden négyzetes részmátrixának determinánsa a $\{0, 1, -1\}$ halmaz eleme. Vizsgáljuk meg az $A$ mátrixot:

- **A teljes mátrix determinánsa:**
  Mivel $A$ egy felső háromszögmátrix (minden elem a főátló alatt 0), a determinánsa a főátlón lévő elemek szorzata:
  $$\det(A) = 1 \cdot 1 \cdot 1 = 1$$
- **Alacsonyabb rendű részmátrixok:**
  A mátrix minden eleme $0$ vagy $1$. Bármely $2 \times 2$-es részmátrixot kiválasztva (például a bal felső sarkot: $1 \cdot 1 - 1 \cdot 0 = 1$) a determináns értéke a $\{0, 1, -1\}$ halmazban marad.

Mivel minden négyzetes részmátrix determinánsa megfelel a feltételnek, az **$A$ mátrix totálisan unimoduláris**.

---

#### Lineáris programozási modell

Írjuk fel a feladatot lineáris programozási (LP) relaxációként, ahol $x_j$ a kirendelt csomagok számát jelöli, és a bináris kényszert feloldva megengedjük a folytonos értékeket:

**Célfüggvény:** $\min (x_1 + x_2 + x_3)$
**Korlátozó feltételek:**

1. $x_1 + x_2 \ge 1$ (M1 állomás ellátása)
2. $x_2 + x_3 \ge 1$ (M2 állomás ellátása)
3. $x_3 \ge 1$ (M3 állomás ellátása)
4. $x_1, x_2, x_3 \ge 0$ (Nemnegativitási korlát)

---

#### Következtetések

Az $A$ mátrix TU tulajdonsága közvetlen hatással van a megoldás minőségére:

- **Garantált egészértékűség:** A Hoffman–Kruskal tétel kimondja, hogy ha a feltételrendszer mátrixa TU és a korlátok (jobb oldali vektor) egész számok, akkor az LP feladat minden bázismegoldása egész koordinátájú. Ebben a feladatban az optimális megoldás $x_1 = 0, x_2 = 0, x_3 = 1$ lesz, de soha nem kapunk törtszámú eredményt.
- **Számítási hatékonyság:** A gyakorlatban ez azt jelenti, hogy a feladat megoldásához elegendő a polinomiális idejű szimplex algoritmust használni. Nem szükséges speciális egészértékű programozási (IP) eljárások alkalmazása, mert a poliéder csúcspontjai eleve egészek.
- **Strukturális integritás:** A mátrix szerkezete (ahol az egyesek minden oszlopban összefüggő blokkot alkotnak) tipikus példája az **intervallum-mátrixoknak**. Ezek a struktúrák bizonyítottan TU tulajdonságúak, ami biztosítja a folyamatok oszthatatlanságát az optimalizáció során, feloldva az ellentmondást a folytonos modell és a diszkrét egységek (csomagok) között.

## Hálózati problémák

A hálózati (network) modellek olyan folyamatokat írnak le, ahol valamilyen entitás (adat, áru, folyadék, áram) áramlik egy pontokból és összeköttetésekből álló rendszerben.

### Miért használjuk őket?

- **Szemléletes:** A valós világ logisztikai, mérnöki vagy informatikai rendszerei közvetlenül lefordíthatók gráfokra (csúcsok és élek).
- **Gyors:** Speciális szerkezetük miatt olyan algoritmusokkal oldhatók meg, amelyek sokkal hatékonyabbak az általános matematikai eljárásoknál.
- **Precíz:** Egyértelműen meghatározható velük a szűk keresztmetszet, a legolcsóbb útvonal vagy a maximális áteresztőképesség.

### A hálózat alapfogalmai

Minden hálózati feladat az alábbi három összetevőre épül:

1.  **Forrás és Nyelő:** A pontok, ahol az anyag belép a rendszerbe (forrás), és ahol elhagyja azt (nyelő).
2.  **Kapacitás:** Az élek (csatornák) fizikai korlátja; ennél több egység nem haladhat át rajtuk.
3.  **Áram (Flow):** A ténylegesen szállított mennyiség, amely nem haladhatja meg a kapacitást, és a köztes pontokban nem "tűnhet el" (ami befolyik, annak ki is kell folynia).

A gyakorlati elemzések során a cél általában ezen áramlás optimalizálása: vagy a mennyiséget maximalizáljuk (Max-Flow), vagy az ehhez tartozó költségeket minimalizáljuk (Min-Cost Flow).

A transshipment (szállítmányozási) probléma lényege, hogy az áru nem feltétlenül közvetlenül a forrástól jut el a célig, hanem köztes elosztó központokon (raktárakon, kikötőkön) is áthaladhat.

Íme egy szemléletes példa a feladat bemutatásához:

### Feladat: Egy webáruház logisztikai hálózata

**A szituáció:**
Egy elektronikai webáruház két nagy gyártócsarnokból (**források**) szállít laptopokat három különböző város üzleteibe (**nyelők**). A szállítást nem közvetlenül végzik, hanem két regionális logisztikai központon (**belső pontok**) keresztül, ahol a szállítmányokat átrakodják és szétválogatják.

**A hálózat adatai:**

- **Gyártók (Források):**
  - **G1:** 100 darab laptopot gyárt (Kínálat: $-100$)
  - **G2:** 150 darab laptopot gyárt (Kínálat: $-150$)
- **Városi üzletek (Nyelők):**
  - **U1:** 80 darab laptopot igényel (Kereslet: $+80$)
  - **U2:** 70 darab laptopot igényel (Kereslet: $+70$)
  - **U3:** 100 darab laptopot igényel (Kereslet: $+100$)
- **Elosztó központok (Belső pontok):**
  - **K1 és K2:** Itt nem gyártanak és nem adnak el semmit (Értékük: $0$). Ami ide beérkezik, annak tovább is kell mennie.

**A hálózat:**

```mermaid
graph LR
    subgraph Források [Gyártók]
        G1(G1: -100)
        G2(G2: -150)
    end

    subgraph Belso [Elosztó Központok]
        K1(K1: 0)
        K2(K2: 0)
    end

    subgraph Nyelők [Üzletek]
        U1(U1: +80)
        U2(U2: +70)
        U3(U3: +100)
    end

    %% Szállítási útvonalak és példa költségek
    G1 -->|500 Ft| K1
    G1 -->|600 Ft| K2
    G2 -->|450 Ft| K1
    G2 -->|550 Ft| K2

    K1 -->|800 Ft| U1
    K1 -->|700 Ft| U2
    K2 -->|650 Ft| U2
    K2 -->|900 Ft| U3
    K1 -->|1000 Ft| U3
```

**A cél:**
Határozzuk meg, hogy melyik útvonalon hány darab laptopot szállítsunk ahhoz, hogy minden üzlet igénye teljesüljön, de a teljes hálózat szállítási költsége a lehető legalacsonyabb legyen.

#### Megoldás

A feladat lineáris programozással megoldható:

**Célfüggvény:**
$$\min Z = 500x_{G1,K1} + 600x_{G1,K2} + 450x_{G2,K1} + 550x_{G2,K2} + 800x_{K1,U1} + 700x_{K1,U2} + 1000x_{K1,U3} + 650x_{K2,U2} + 900x_{K2,U3}$$

**Korlátozó feltételek:**

- **Források (Kínálat):**
  - $x_{G1,K1} + x_{G1,K2} = 100$
  - $x_{G2,K1} + x_{G2,K2} = 150$
- **Átrakodó állomások (Mérlegegyenlet):**
  - $x_{G1,K1} + x_{G2,K1} - (x_{K1,U1} + x_{K1,U2} + x_{K1,U3}) = 0$
  - $x_{G1,K2} + x_{G2,K2} - (x_{K2,U2} + x_{K2,U3}) = 0$
- **Nyelők (Kereslet):**
  - $x_{K1,U1} = 80$
  - $x_{K1,U2} + x_{K2,U2} = 70$
  - $x_{K1,U3} + x_{K2,U3} = 100$
- **Nemnegativitás:**
  - $x_{i,j} \ge 0 \quad \forall (i,j) \in E$

### Feladat: Logisztikai konténerek optimalizálása

Egy tengeri szállítmányozó cégnek egy **6 hetes** projekt során speciális hűtőkonténerekre van szüksége. A heti igények a következők:

- **1. hét:** 40 db
- **2. hét:** 60 db
- **3. hét:** 90 db
- **4. hét:** 80 db
- **5. hét:** 100 db
- **6. hét:** 70 db

A szükségletet három forrásból fedezhetik:

1.  **Új konténer bérlése:** **1500 EUR** / db (azonnal elérhető).
2.  **Gyors szerviz:** **1 hét** átfutási idő (az $i$. hét végén leadott konténer az $i+2$. hét elején kész), költsége **600 EUR** / db.
3.  **Lassú szerviz:** **2 hét** átfutási idő (az $i$. hét végén leadott konténer az $i+3$. hét elején kész), költsége **250 EUR** / db.

A használt konténerek tárolása a telephelyen ingyenes. A cél a projekt teljes költségének minimalizálása.

#### Megoldás és költségszámítás

| Hét    | Igény ($d_i$) | Megoldás forrása                            | Számítás (db × EUR)                  | Költség |
| :----- | :------------ | :------------------------------------------ | :----------------------------------- | :------ |
| **1.** | 40            | 40 új bérlés                                | $40 \times 1500$                     | 60 000  |
| **2.** | 60            | 60 új bérlés                                | $60 \times 1500$                     | 90 000  |
| **3.** | 90            | 40 gyors (1. hétről) + 50 új                | $(40 \times 600) + (50 \times 1500)$ | 99 000  |
| **4.** | 80            | 60 lassú (2. hétről) + 20 új                | $(60 \times 250) + (20 \times 1500)$ | 45 000  |
| **5.** | 100           | 90 lassú (3. hétről) + 10 gyors (4. hétről) | $(90 \times 250) + (10 \times 600)$  | 28 500  |
| **6.** | 70            | 70 lassú (4. hétről maradt 70)              | $70 \times 250$                      | 17 500  |

**Összesített adatok:**

- **Összes bérelt új konténer:** 170 db
- **Összes gyors szerviz:** 50 db
- **Összes lassú szerviz:** 220 db
- **Minimális összköltség:** **340 000 EUR**

#### Hálózati modell (Min-Cost Flow)

A feladat egy irányított gráffal reprezentálható, ahol:

- **Csúcsok:** Minden héthez két csúcs tartozik: $u_i$ (a hét végén keletkező használt konténerek) és $v_i$ (a hét eleji konténerigény).
- **Kínálat/Kereslet:** Minden $u_i$ csúcs kínálata $d_i$, minden $v_i$ csúcs kereslete $d_i$.
- **Élek:**
  - **Vásárlás:** Forrás $\rightarrow v_i$ él, költség: $1500$.
  - **Gyors szerviz:** $u_i \rightarrow v_{i+2}$ él, költség: $600$.
  - **Lassú szerviz:** $u_i \rightarrow v_{i+3}$ él, költség: $250$.
  - **Várakozás:** $u_i \rightarrow u_{i+1}$ él, költség: $0$.

```mermaid
graph TD
    S((Forrás))

    subgraph Supply [Kínálat: Használt konténerek]
        direction LR
        u1(u1: 40) --- u2(u2: 60) --- u3(u3: 90) --- u4(u4: 80) --- u5(u5: 100) --- u6(u6: 70)
    end

    subgraph Demand [Kereslet: Szükséges konténerek]
        direction LR
        v1(v1: 40) --- v2(v2: 60) --- v3(v3: 90) --- v4(v4: 80) --- v5(v5: 100) --- v6(v6: 70)
    end

    S -- 1500 --> v1
    S -- 1500 --> v2
    S -- 1500 --> v3
    S -- 1500 --> v4
    S -- 1500 --> v5
    S -- 1500 --> v6

    u1 -- 600 --> v3
    u2 -- 600 --> v4
    u3 -- 600 --> v5
    u4 -- 600 --> v6

    u1 -- 250 --> v4
    u2 -- 250 --> v5
    u3 -- 250 --> v6

    u1 -. 0 .-> u2
    u2 -. 0 .-> u3
    u3 -. 0 .-> u4
    u4 -. 0 .-> u5
    u5 -. 0 .-> u6
```
