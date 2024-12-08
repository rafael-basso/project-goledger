import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router'
import '../App.css';
import BasicModal from '../components/Modal';

function Playlists() {
  interface Playlist {
    name: string;
    songs?: { "@key": string }[];
  }

  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaylist, setFilteredPlaylist] = useState<Playlist[]>([]);
  const credentials = btoa(`${process.env.REACT_APP_API_USER}:${process.env.REACT_APP_API_PASSWD}`);

  useEffect(() => {
    const fetchData = async () => {
      const search = {
        "query": {
          "selector": {
            "@assetType": "playlist"
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
        setPlaylist(res.result);
        setFilteredPlaylist(res.result);
      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = playlist.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaylist(results);
  }, [searchTerm, playlist]);

  async function createPlaylist() {
    const name = window.prompt("Enter name of playlist:");
    if (name === null) return;

    const privatePlaylist = window.confirm("Is the playlist private? Click 'OK' if YES and 'CANCEL if NO");;
    // console.log(privatePlaylist);

    if (!name) {
      alert('Name of playlist and song ID cannot be empty!');
    } else {
      const table = document.querySelector('.table-container');
      const loading = document.querySelector('.loading-container');

      table?.classList.add('d-none');
      loading?.classList.remove('d-none');
      loading?.classList.add('d-flex');

      const resquestJson = {
        "asset": [
          {
            "@assetType": "playlist",
            "name": `${name}`,
            "private": privatePlaylist,
            "songs": []
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

          alert("Playlist created successfully!");
          window.location.reload();
        }

      } catch (ex) {
        const err = ex as Error;

        setLoading(true);
        setError(err.message);
      }
    }
  }

  async function deletePlaylist(name: string) {
    const table = document.querySelector('.table-container');
    const loading = document.querySelector('.loading-container');

    table?.classList.add('d-none');
    loading?.classList.remove('d-none');
    loading?.classList.add('d-flex');

    const requestJson = {
      "key": {
        "@assetType": "playlist",
        "name": `${name}`
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

        alert("Playlist deleted successfully!");
        window.location.reload();
      }

    } catch (ex) {
      const err = ex as Error;

      setLoading(true);
      setError(err.message);
    }
  }

  async function addSong(playlist: Playlist) {
    const newSong = window.prompt("Enter song ID:");
    if (newSong === null) return;

    const newSongJson = {
        "@assetType": "song" ,
        "@key": newSong
    }

    playlist.songs?.push(newSongJson);

    const table = document.querySelector('.table-container');
    const loading = document.querySelector('.loading-container');

    table?.classList.add('d-none');
    loading?.classList.remove('d-none');
    loading?.classList.add('d-flex');

    const requestJson = {
      "update": {
          "@assetType": "playlist",
          "name": `${playlist.name}`,
          "songs": playlist.songs
      }
    };

    console.log(requestJson);
 
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

        alert("Song added successfully!");
        window.location.reload();
      }

    } catch (ex) {
      const err = ex as Error;

      setLoading(true);
      setError(err.message);
    }
  }

  async function getSongName(id: string) {
    const getSong = {
      "query": {
        "selector": {
          "@assetType": "song",
          "@key": `${id}`
        }
      }
    };

    const responseSong = await fetch('http://ec2-54-91-215-149.compute-1.amazonaws.com/api/query/search', {
      'method': 'POST',
      'headers': {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(getSong),
    });

    if (!responseSong.ok) throw new Error(`Error fetching data. Status: ${responseSong.statusText}`);

    const artistName = await responseSong.json();
    // console.log(artistName.result[0].name);
    artistName.result.map((x:{name: string}) => alert(x.name));
}
  
  return (
    <>
      <div className='table-container'>
        <div className='title'>
          <h1>PLAYLISTS</h1>
          <Link to="/">
            <strong>Go to ARTISTS</strong>
          </Link>
          <Link to="/album">
            <strong>Go to ALBUMS</strong>
          </Link>
          <Link to="/song">
            <strong>Go to SONGS</strong>
          </Link>
        </div>
        <button onClick={createPlaylist}>Create new playlist</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredPlaylist.map((item: Playlist, index: number) => (
          <table key={index}>
            <thead>
              <tr>
                <td>Name</td>
                <td>Songs</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{item.name}</td>
                <td>{item.songs?.map((song: {"@key": string}) => (
                      <>
                      <p>{song["@key"]}
                        <button onClick={() => getSongName(song["@key"])}>view name</button>
                      </p>
                      </>
                    ))}
                </td>
                <td>
                  <button onClick={() => deletePlaylist(item.name)}>delete</button>
                  <button onClick={() => addSong(item)}>add song</button>                  
                </td>
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
      {filteredPlaylist.length === 0 && <p>No artists found.</p>}
    </>
  );
}

export default Playlists;