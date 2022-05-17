## Zadání

1. Založ nový projekt pomocí [create-czechitas-app](https://www.npmjs.com/package/create-czechitas-app).
   1. ```sh
        npx create-czechitas-app czechitas-backend-workshop
        cd czechitas-backend-workshop
        npm start
      ```

1. Přichystej komponentu `NakupniSeznam` v `./src/components/NakupniSeznam.jsx`.

   1. Vlož ji do stránky.
   2. Přidej komponentě stav s polem objektů.

      ```js
      const [polozky, setPolozky] = useState([
      	{
      		nazev: 'První hardcodovaná položka',
      	},
      	{
      		nazev: 'Druhá hardcodovaná položka',
      	},
      ])
      ```

   3. Vypiš položky do odrážkového seznamu.

      ```
      <ul>
         {polozky.map((polozka) => (
            <li key={polozka.nazev}>{polozka.nazev}</li>
         ))}
      </ul>
      ```

   4. Zkontroluj v prohlížeči. Měl by se na stránce ukázat seznam o dvou položkách.

1. Ve Firebase konzoli ([https://console.firebase.google.com/](https://console.firebase.google.com/)) přidej nový projekt. Pojmenuj ho například `Nakupni seznam`. Stiskni tlačítko `Continue`.

1. V kroku `Google Analytics for your Firebase project` zruš zapnuté Analytics. Nejsou důležité a komplikují vytvoření první aplikace.

1. V projektu přejdi v levém menu do záložky `Build` a `Firestore Database`.

   1. Stiskni tlačítko `Create database`.
   2. Zaškrtni `Start in test mode`.
   3. V dalším kroku pro polohu zvol `eur3 (europe-west)`.

1. Vytvoř kolekci pomocí `Start collection` s názvem (Collection ID) `seznam`.

   1. V ní vytvoř první dokument s `Auto-ID` (<- kliknout) a s fieldem `nazev`, typ `string` a value `První položka`.
   1. Přidej druhý dokument (Add document) s `Auto-ID` a s fieldem `nazev`, typ `string` a value `Druhá položka`.

2. V `Project overview` v sekci `Get started by adding Firebase to your app` přidej Web app přes tlačítko `Web`.

   1. Pojmenuj ji `Nakupní seznam`.
   2. Nezaškrtávej `Firebase Hosting`. Pro hostování jsme si ukazovali Netlify ([video](https://www.youtube.com/watch?v=sAcJKh6n5DA&list=PLTCx5oiCrIJ5t0LiyDOpBDTgcs-d99UwD&index=30)). Není potřeba se učit nový hosting.
   3. Register app.
   4. Nech si stránku otevřenou.

1. V terminálu ve složce s projektem z kroku 1 nainstaluj Firebase SDK pomocí `npm install firebase --save`.
1. Ve složce `src/components` vytvoř soubor `db.jsx`.

   1. Naimportuj v něm Firestore
      ```js
      import { getFirestore } from 'firebase/firestore'
      ```
   2. Zkopíruj do něj všechen kód z otevřené stránky prohlížeče  `import { initializeApp } from "firebase/app"`...
   3. Exportuj konstantu pro přístup k databázi `export const db = getFirestore(app)`

2. Hardcodované položky nahraď za položky z db.
   1. Naimportuj do komponenty soubor `db.js`.
   1. Naimportuj do komponenty potřebné funkce z firebase `import { collection, onSnapshot  } from 'firebase/firestore'`.
   2. Přidej `useEffect`, který se vykoná jen při prvním renderu.

      ```js
      useEffect(() => {}, [])
      ```

   3. V efektu zavolej `onSnapshot` metody, která se spustí při každé změně v kolekci `seznam`.

      ```js
      onSnapshot(collection(db, 'seznam'), (querySnapshot) => {})
      ```

   4. Při přijetí změn (`onSnapshot`) aktualizuj stav `polozky`.

      ```js
      setPolozky(querySnapshot.docs.map((dokument) => dokument.data()))
      ```

   5. Nastav počáteční stav na prázdné pole. Smaž hardcodované objekty.

1. Zkus ve Firebase konzoli přidat do seznamu novou položku. Měla by se ihned objevit i na tvé stránce.

1. `useEffect` by si po sobě měl i uklidit pro případ, že se komponenta odpojí ze stránky.

   1. `db.collection('seznam').onSnapshot` vrací funkci pro vypnutí poslouchání změn. Pokud ji v `useEffect` vrátíme, React ji ve správný čas spustí a vypne tím posluchač. Přidej před zmíněný kód `return`.

1. Vytvoř formulář na přidávání položek.

   1. Přidej stav pro textové políčko `const [nazev, setNazev] = useState('')`.
   2. Přidej funkci, která se postará o uložení dat a resetování formuláře. Nezepomen pridat import funkce `addDoc` z Firebase.
      ```js
      const pridejPolozku = () => {
         addDoc(collection(db, 'seznam'),{ nazev })
         setNazev('')
      }
      ```
   3. Přidej textový vstup a tlačítko pro přidání.
      ```html
         <label>
            Název:{' '}
            <input
               value={nazev}
               onChange={(event) => setNazev(event.target.value)}
            />
         </label>
         <button onClick={pridejPolozku}>Přidat</button>
      ```
1. Seřaď položky podle názvu.

   1. Vytvoř dotaz (query) kterým budeš hledat v databazi

      ```js
      const dotaz = query(collection(db, 'seznam'), orderBy("nazev"))
      ```

   2. Nezapomeň na import `query, orderBy` z firebase.
   3. Uprav funkci na stažení seznamu tak, aby použila náš dotaz.

      ```js
      return onSnapshot(dotaz, (querySnapshot) => {
        setPolozky(querySnapshot.docs.map((dokument) => dokument.data()))
      })
      ```

1. Přidej možnost položky mazat.

   1. Za název položky přidej tlačítko `<button>smazat</button>`.
   2. Přidej ke každé položce ID, budeme ho potřebovat pro smazání položky
      ```js
      setPolozky(querySnapshot.docs.map((dokument) => { 
         return { ...dokument.data(), id: dokument.id }
      }))
      ```
   3. Přidej funkci pro smazání položky podle id. Nezapomeň na import `deleteDoc, doc` z firebase.

      ```js
      const smazPolozku = (polozka) => {
         deleteDoc(doc(db, 'seznam', polozka.id))
      }
      ```
   4. Zavolej funkci pro smazání položky při kliknutí na tlačítko (button) `onClick={() => smazPolozku(polozka)}`
   
1. Přidej uživateli možnost označovat položky jako koupené.
   1. Při přidávání položky do seznamu jí nastav `koupeno: false`.
   2. Přidej funkci pro editaci položky, která přepne hodnotu `koupeno`. Nezapomeň na import `updateDoc` z firebase.
      ```js
      const upravPolozku = (polozka) => {
         updateDoc(doc(db, 'seznam', polozka.id), { koupeno: !polozka.koupeno })
      }
      ```
   3. V mapě pro výpis položek přidej checkbox pro každou položku.
      ```html
      <input type="checkbox" checked={!!polozka.koupeno} onChange={() => upravPolozku(polozka)} />
      ```
1. Skryj již zakoupené položky úpravou dotazu - přidáním podmínky. Nezapomeň přidat import `where` z firebase.
      ```js
      const dotaz = query(collection(db, 'seznam'), where('koupeno', '!=', true))
      ```



## Bonus: Fetch a Promise
Zobraz data z Google API Books a přidej je do své stránky.

1. Přichystej komponentu `SeznamKnizek` v `./src/components/SeznamKnizek.jsx`.

   1. Vlož ji do stránky.
   2. Přidej komponentě stav s polem objektů.

      ```js
      const [knizky, setKnizky] = useState([])
      ```

   3. Přidej komponentě stav s klíčovým slovem pro vyhledávání

      ```js
      const [klicovyVyraz, setKlicovyVyraz] = useState('');
      ```
   4. Přidej textový vstup a tlačítko pro hledání.
      ```jsx
      <div>
        <label>
          Název knížky:{" "} 
          <input 
          value={klicovyVyraz} 
          onChange={(event) => setKlicovyVyraz(event.target.value)} />
        </label>
        <button onClick="{hledejKnizku}">Hledat</button>
      </div>
      ```
2. Přidej funkci `hledejKnizku`, která se postará o zobrazení dat z Google API Books. 
      ```js
      const hledejKnizku = () => {
      const dotaz = `https://www.googleapis.com/books/v1/volumes?q=intitle:${klicovyVyraz}`; // adresa dotazu + klíčový výraz, který uživatel zadá do vyhledávání

      fetch(dotaz) 
      /* fetch vrací Promise, na který je třeba počkat. K tomu slouží metoda .then(), která se spustí až ve chvíli, kdy jsou data dostupná. */
         .then((response) => response.json()) // převedeme tělo odpovědi
         .then((data) => { // response.json() vrací promise, proto musíme zase použít metodu .then()
            setKnizky(data.items); // zde už uložíme data o knížkách do výše vytvořeného stavu 
         })
         .catch((err) => {
            console.log(err); // případné errory odchytíme v konzoli
         });
      };
      ```
3. Vypiš položky do odrážkového seznamu.

      ```
      <ul>
        {knizky?.map((volume, index) => (
          <li key={index}> {volume.volumeInfo.title} </li>
        ))}
      </ul>
      ```
