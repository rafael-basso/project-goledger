import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router'
import '../App.css';
import { count } from 'console';

function Artists() {
  interface Artist {
    country: string;
    name: string;
  }

  const [artist, setArtist] = useState<Artist[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const credentials = btoa(`${process.env.REACT_APP_API_USER}:${process.env.REACT_APP_API_PASSWD}`);

  useEffect(() => {
    const fetchData = async () => {
      const search = {
        "query": {
          "selector": {
            "@assetType": "artist"
          }
        }
      };

      try {
        const response = await fetch('http://ec2-54-91-215-149.compute-1.amazonaws.com/api/query/search', {
          'method': 'POST',
          'headers': {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(search),
          'credentials': 'omit'
        });

        if (!response.ok) throw new Error(`Error fetching data. Status: ${response.statusText}`);

        const res = await response.json();
        // console.log(res.result);
        setArtist(res.result);
      } catch (ex) {
        const err = ex as Error;
        
        setLoading(true);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  async function createArtist() {
    const name = window.prompt("Enter name:");
    if (name === null) return;

    const country = window.prompt("Enter country:");
    if (country === null) return;

    if (!name || !country) {
      alert('Name and country cannot be empty!');
    } else {
      const table = document.querySelector('.table-container');
      const loading = document.querySelector('.loading-container');

      table?.classList.add('d-none');
      loading?.classList.remove('d-none');
      loading?.classList.add('d-flex');

      const resquestJson = {
        "asset": [
          {
            "@assetType": "artist",
            "name": `${name}`,
            "country": `${country}`
          }
        ]
      };

      try {
        const response = await fetch('http://ec2-54-91-215-149.compute-1.amazonaws.com/api/invoke/createAsset', {
          'method': 'POST',
          'headers': {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(resquestJson),
          'credentials': 'omit'
        });

        if (!response.ok) throw new Error(`Error fetching data. Status: ${response.statusText}`);

        table?.classList.remove('d-none');
        table?.classList.add('d-flex');
        loading?.classList.add('d-none');

        alert("Asset created successfully!");
        window.location.reload();
      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    }
  }

  function deleteArtist() {

  }

  function updateArtist() {
    
  }
  
  return (
    <>
      <div className='table-container'>
        <div className='title'>
          <h1>ARTISTS</h1>
          <Link to="/album">
            <strong>Go to Albums</strong>
          </Link>
        </div>
        <button onClick={createArtist}>Create new artist</button>
        {artist.map((item: Artist, index: number) => (
          <table key={index}>
            <thead>
              <tr>
                <td>Type</td>
                <td>Country</td>
                <td>Name</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Artist</td>
                <td>{item.country}</td>
                <td>{item.name}</td>
                <td><button>edit</button><button>delete</button></td>
              </tr>
            </tbody>
          </table>
        ))}        
        {loading && (<p>{error}</p>)}
      </div>
      <div className="loading-container d-none">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
    </div>
    </>
  );
}

export default Artists;