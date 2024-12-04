import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  interface DataType {
    description: string;
    dynamic: boolean;
    label: string;
    tag: string;
    writers: string | null;
  }

  const [data, setData] = useState<DataType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const credentials = btoa('psAdmin:goledger');

      try {
        const response = await fetch('http://ec2-54-91-215-149.compute-1.amazonaws.com/api/query/getSchema', {
          'method': 'GET',
          'headers': {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          'credentials': 'omit'
        });

        if (!response.ok) throw new Error(`Error fetching data. Status ${response.statusText}`);

        const result = await response.json();
        setData(result);
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
        {data.map((item: DataType, index: number) => (
          <table key={index}>
            <thead>
              <tr>
                {item.tag === 'artist' ? (<td>Artist</td>) :
                  item.tag === 'album' ? (<td>Album</td>) :
                    item.tag === 'song' ? (<td>Song</td>) :
                      item.tag === 'playlist' ? (<td>Playlist</td>) : (<td>Data Type of List</td>)}
                <td>Description</td>
                <td>Dynamic</td>
                <td>Label</td>
                <td>Writers</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{item.tag}</td>
                <td>{item.description}</td>
                <td>{item.dynamic ? 'true' : 'false'}</td>
                <td>{item.label}</td>
                <td>{item.writers ?? 'no content'}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
      {loading && (<p>{error}</p>)}
    </>
  );
}

export default App;