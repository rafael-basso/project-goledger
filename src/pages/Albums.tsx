import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router';

function Albums() {
  interface Album {
    name: string;
    year: number;
  }

  const [album, setAlbum] = useState<Album[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const credentials = btoa(`${process.env.REACT_APP_API_USER}:${process.env.REACT_APP_API_PASSWD}`);
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
      } catch (ex) {
        const err = ex as Error;
        
        setLoading(true);
        setError(err.message);
      }
    };

    fetchData();
  }, []);
  
  return (
    <>
      <div className='table-container'>
      <div className='title'>
          <h1>ALBUMS</h1>
          <Link to="/">
            <strong>Go to Artists</strong>
          </Link>
        </div>
        {album.map((item: Album, index: number) => (
          <table key={index}>
            <thead>
              <tr>
                <td>Name</td>
                <td>Year</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{item.name}</td>
                <td>{item.year}</td>
              </tr>
            </tbody>
          </table>
        ))}        
      </div>      
      {loading && (<p>{error}</p>)}
    </>
  );
}

export default Albums;