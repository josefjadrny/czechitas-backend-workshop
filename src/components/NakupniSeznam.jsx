import React, { useState, useEffect } from 'react'
import { collection, onSnapshot  } from 'firebase/firestore';
import  { db } from './db'

export function NakupniSeznam() {
    const [polozky, setPolozky] = useState([])

    useEffect(() => {      
      onSnapshot(collection(db, "seznam"), (querySnapshot) => {
        setPolozky(querySnapshot.docs.map((dokument) => dokument.data()))
      })
    }, [])

    return (
      <ul>
        {polozky.map((polozka) => (
           <li key={polozka.nazev}>{polozka.nazev}</li>
        ))}
     </ul>
    );
  }
