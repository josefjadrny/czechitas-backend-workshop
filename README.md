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
      import { getFirestore } from 'firebase/firestore';
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
      const addData = () => {
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
         <button onClick={addData}>Přidat</button>
      ```
2. Seřaď položky podle názvu.

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

   4. Přidejte limit na počet položek - upravte dotaz. Nezapomeňte přidat import `limit` z firebase.

      ```js
      const dotaz = query(collection(db, 'seznam'), orderBy("nazev"), limit(5))
      ```
   5. Skryjte "První položka" úpravou dotazu - přidáním podmínky. Nezapomeňte přidat import `where` z firebase.

      ```js
      const dotaz = query(collection(db, 'seznam'), where("nazev", "!=", "První položka"), orderBy("nazev"), limit(5))
      ```