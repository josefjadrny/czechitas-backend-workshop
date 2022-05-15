import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, query, orderBy, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from './db'

export function NakupniSeznam() {
  const [polozky, setPolozky] = useState([])
  const [nazev, setNazev] = useState('')

  useEffect(() => {
    const dotaz = query(collection(db, 'seznam'), where('koupeno', '!=', true))

    return onSnapshot(dotaz, (querySnapshot) => {
      setPolozky(querySnapshot.docs.map((dokument) => {
        return { ...dokument.data(), id: dokument.id }
      }))
    })
  }, [])

  const pridejPolozku = () => {
    addDoc(collection(db, 'seznam'), { nazev, koupeno: false })
    setNazev('')
  }

  const smazPolozku = (polozka) => {
    deleteDoc(doc(db, 'seznam', polozka.id))
  }

  const upravPolozku = (polozka) => {
    updateDoc(doc(db, 'seznam', polozka.id), { koupeno: !polozka.koupeno })
  }

  return (
    <>
      <ul>
        {polozky.map((polozka) => (
          <li key={polozka.nazev}>
            <input type="checkbox" checked={!!polozka.koupeno} onChange={() => upravPolozku(polozka)} />
            {polozka.nazev} 
            <button onClick={() => smazPolozku(polozka)}>smazat</button>
          </li>
        ))}
      </ul>
      <label>
        Název:{' '}
        <input
          value={nazev}
          onChange={(event) => setNazev(event.target.value)}
        />
      </label>
      <button onClick={pridejPolozku}>Přidat</button>
    </>
  );
}
