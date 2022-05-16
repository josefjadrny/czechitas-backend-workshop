import React, { useState, useEffect } from 'react';

export function SeznamKnizek() {
  const [knizky, setKnizky] = useState([]);
  const [klicovyVyraz, setKlicovyVyraz] = useState('');

  const hledejKnizku = () => {
    const dotaz = `https://www.googleapis.com/books/v1/volumes?q=intitle:${klicovyVyraz}`;

    fetch(dotaz)
      .then((response) => response.json())
      .then((data) => {
        setKnizky(data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <label>
        Název knizky:{" "}
        <input
          value={klicovyVyraz}
          onChange={(event) => setKlicovyVyraz(event.target.value)}
        />
      </label>
      <button onClick={hledejKnizku}>Hledat</button>
      <ul>
        {knizky?.map((volume, index) => (
          <li key={index}> {volume.volumeInfo.title} </li>
        ))}
      </ul>
    </div>
  );
}
