import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router';

function Albums() {
  interface Album {
    name: string;
    year: number;
    "@key": string;
    artist: { "@key": string }
  }

  const [album, setAlbum] = useState<Album[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlbum, setFilteredAlbum] = useState<Album[]>([]);
  const credentials = btoa(`${process.env.REACT_APP_API_USER}:${process.env.REACT_APP_API_PASSWD}`);

  useEffect(() => {
    const fetchData = async () => {
      const search = {
        "query": {
          "selector": {
            "@assetType": "album"
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
        setAlbum(res.result);
        setFilteredAlbum(res.result);
      } catch (ex) {
        const err = ex as Error;
        
        setLoading(true);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = album.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlbum(results);
  }, [searchTerm, album]);

  async function createAlbum() {
    const name = window.prompt("Enter name of album:");
    if (name === null) return;

    const year = window.prompt("Enter year:") ?? "";
    if (year === null) {
      return;
    } else if (!/^\d+$/.test(year)) {
      alert("Please enter numbers only");
      return;
    } else {
      parseInt(year);
    }

    const idArtist = window.prompt("Enter Artist ID:");
    if (idArtist === null) return;

    if (!name || !year || !idArtist) {
      alert('Name, country and Artist ID cannot be empty!');
    } else {
      const table = document.querySelector('.table-container');
      const loading = document.querySelector('.loading-container');

      table?.classList.add('d-none');
      loading?.classList.remove('d-none');
      loading?.classList.add('d-flex');

      const resquestJson = {
        "asset": [
          {
            "@assetType": "album",
            "name": `${name}`,
            "year": `${year}`,
            "artist": {
              "@assetType": "artist",
              "@key": `${idArtist}`
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
          // console.log(response);
          throw new Error(`Error fetching data. Status: ${response.statusText}`);
        } else {
          table?.classList.remove('d-none');
          table?.classList.add('d-flex');
          loading?.classList.add('d-none');
  
          alert("Album created successfully!");
          window.location.reload();
        }

      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    }
  }

  async function updateAlbum(name: string, id: string) {
    const year = window.prompt("Enter new year of album:") ?? "";
    if (year === null) {
      return;
    } else if (!/^\d+$/.test(year)) {
      alert("Please enter numbers only");
      return;
    } else {
      parseInt(year);
    }

    if (!year) {
      alert("New year of album must not be empty!");
    } else {
      const table = document.querySelector('.table-container');
      const loading = document.querySelector('.loading-container');

      table?.classList.add('d-none');
      loading?.classList.remove('d-none');
      loading?.classList.add('d-flex');

      const requestJson = {
        "update": {
          "@assetType": "album",
          "name": `${name}`,
          "year": `${year}`,
          "artist": {
              "@assetType": "artist",
              "@key": `${id}`
          }
        }
      };

      try {
        const response = await fetch('http://ec2-54-91-215-149.compute-1.amazonaws.com/api/invoke/updateAsset', {
          'method': 'PUT',
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

          throw new Error(`Error fetching data. Status: ${response.statusText}`);
        } else {
          table?.classList.remove('d-none');
          table?.classList.add('d-flex');
          loading?.classList.add('d-none');

          alert("Year of album updated successfully!");
          window.location.reload();
        }

      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    }
  }

  async function deleteAlbum(name: string, id: string) {
    const table = document.querySelector('.table-container');
    const loading = document.querySelector('.loading-container');

    table?.classList.add('d-none');
    loading?.classList.remove('d-none');
    loading?.classList.add('d-flex');

    const requestJson = {
      "key": {
        "@assetType": "album",
        "name": `${name}`,
        "artist": {
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

        throw new Error(`Error fetching data. Status: ${response.statusText}`);
      } else {
        table?.classList.remove('d-none');
        table?.classList.add('d-flex');
        loading?.classList.add('d-none');

        alert("Album deleted successfully!");
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
          <h1>ALBUMS</h1>
          <Link to="/">
            <strong>Go to ARTISTS</strong>
          </Link>
          <Link to="/song">
            <strong>Go to SONGS</strong>
          </Link>
          <Link to="/playlist">
            <strong>Go to PLAYLISTS</strong>
          </Link>
        </div>
        <button onClick={createAlbum}>Create new album</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredAlbum.map((item: Album, index: number) => (
          <table key={index}>
            <thead>
              <tr>
                <td>Name</td>
                <td>Year</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{item.name}<p>{item['@key']}</p></td>
                <td>{item.year}</td>
                <td><button onClick={() => updateAlbum(item.name, item.artist["@key"])}>edit</button><button onClick={() => deleteAlbum(item.name, item.artist["@key"])}>delete</button></td>
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
      {filteredAlbum.length === 0 && <p>No albums found.</p>}
    </>
  );
}

export default Albums;