import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router'
import '../App.css';

function Songs() {
  interface Song {
    name: string;
    "@key": string;
    album: { "@key": string }
  }

  const [song, setSong] = useState<Song[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSong, setFilteredSong] = useState<Song[]>([]);
  const credentials = btoa(`${process.env.REACT_APP_API_USER}:${process.env.REACT_APP_API_PASSWD}`);

  useEffect(() => {
    const fetchData = async () => {
      const search = {
        "query": {
          "selector": {
            "@assetType": "song"
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
        setSong(res.result);
        setFilteredSong(res.result);
      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = song.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSong(results);
  }, [searchTerm, song]);

  async function createSong() {
    const name = window.prompt("Enter name of song:");
    if (name === null) return;

    const idAlbum = window.prompt("Enter Album ID:");
    if (idAlbum === null) return;

    if (!name ||!idAlbum) {
      alert('Name of song and Album ID cannot be empty!');
    } else {
      const table = document.querySelector('.table-container');
      const loading = document.querySelector('.loading-container');

      table?.classList.add('d-none');
      loading?.classList.remove('d-none');
      loading?.classList.add('d-flex');

      const resquestJson = {
        "asset": [
          {
            "@assetType": "song",
            "name": `${name}`,
            "album": {
              "@assetType": "album",
              "@key": `${idAlbum}`
            }
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

        if (!response.ok) {
          loading?.classList.remove('d-flex');
          loading?.classList.add('d-none');

          throw new Error(`Error fetching data. Status: ${response.statusText}`);
        } else {
          table?.classList.remove('d-none');
          table?.classList.add('d-flex');
          loading?.classList.add('d-none');

          alert("Song created successfully!");
          window.location.reload();
        }

      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    }
  }

  async function deleteSong(name: string, id: string) {
    const table = document.querySelector('.table-container');
    const loading = document.querySelector('.loading-container');

    table?.classList.add('d-none');
    loading?.classList.remove('d-none');
    loading?.classList.add('d-flex');

    const requestJson = {
      "key": {
        "@assetType": "song",
        "name": `${name}`,
        "album": {
            "@assetType": "artist",
            "@key": `${id}`
        }
      }
    };

    try {
      const response = await fetch('http://ec2-54-91-215-149.compute-1.amazonaws.com/api/invoke/deleteAsset', {
        'method': 'DELETE',
        'headers': {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify(requestJson),
        'credentials': 'omit'
      });

      if (!response.ok) {
        loading?.classList.remove('d-flex');
        loading?.classList.add('d-none');

        throw new Error(`Status: ${response.statusText}. There is reference content to this song.`);
      } else {
        table?.classList.remove('d-none');
        table?.classList.add('d-flex');
        loading?.classList.add('d-none');

        alert("Song deleted successfully!");
        window.location.reload();
      }

    } catch (ex) {
      const err = ex as Error;

      setLoading(true);
      setError(err.message);
    }
  }
  
  return (
    <>
      <div className='table-container'>
        <div className='title'>
          <h1>SONGS</h1>
          <Link to="/">
            <strong>Go to ARTISTS</strong>
          </Link>
          <Link to="/album">
            <strong>Go to ALBUMS</strong>
          </Link>
          <Link to="/playlist">
            <strong>Go to PLAYLISTS</strong>
          </Link>
        </div>
        <button onClick={createSong}>Create new song</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredSong.map((item: Song, index: number) => (
          <table key={index}>
            <thead>
              <tr>
                <td>Name</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{item.name}<p>{item['@key']}</p></td>
                <td><button onClick={() => deleteSong(item.name, item.album["@key"])}>delete</button></td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
      <div className="loading-container d-none">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
      {loading && (<p>{error}</p>)}
      {filteredSong.length === 0 && <p>No artists found.</p>}
    </>
  );
}

export default Songs;