import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, query, orderBy, limit, where  } from 'firebase/firestore'
import  { db } from './db'

export function NakupniSeznam() {
    const [polozky, setPolozky] = useState([])
    const [nazev, setNazev] = useState('')

    useEffect(() => {      
      const dotaz = query(collection(db, 'seznam'), where("nazev", "!=", "První položka"), orderBy("nazev"), limit(5))

      return onSnapshot(dotaz, (querySnapshot) => {
        setPolozky(querySnapshot.docs.map((dokument) => dokument.data()))
      })
    }, [])

    const addData = () => {
      addDoc(collection(db, 'seznam'),{ nazev })
      setNazev('')
   }

    return (
      <>
        <ul>
          {polozky.map((polozka) => (
            <li key={polozka.nazev}>{polozka.nazev}</li>
          ))}
      </ul>
      <label>
          Název:{' '}
            <input
              value={nazev}
              onChange={(event) => setNazev(event.target.value)}
            />
          </label>
        <button onClick={addData}>Přidat</button>
      </>
    );
  }
