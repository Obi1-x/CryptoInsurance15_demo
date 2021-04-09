import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import env from './env';
import './App.css';

// interface inputDataMsg {
//   username: string;
//   prevState: undefined
// }

function App() {
  const [hashsurance, setHashsurance] = useState(undefined);
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('env', env.api);
    const init = async () => {
      const { hashsurance } = await getBlockchain();
      if ('readData()' in hashsurance === false) {
        setHashsurance(hashsurance);
        setData('Select Required Metamask network');
        return;
      }
      const data = await hashsurance.readData();
      setHashsurance(hashsurance);
      setData(data);
    };
    init();
  }, []);

  const updateData = async e => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    const tx = await hashsurance.updateData(data);
    await tx.wait();
    const newData = await hashsurance.readData();
    setData(newData);
  };


  if (
    (typeof helloWorld === 'undefined'
      || typeof data === 'undefined')
  ) {
    console.log(helloWorld, data);
    return `<div>Loading...</div>`;
  }

  return (
    <div className='container'>
      {/* if Metamask not selected prompt message */}
      {'readData()' in hashsurance === false && <div className="row">{data.toString()}</div>}

      {/* if Metamask is selectected */}
      {'readData()' in hashsurance === true && <div className='row'>
        <div className='col-sm-6'>
          <h2>Data:</h2>
          <p>{data.toString()}</p>
        </div>

        <div className='col-sm-6'>
          <h2>Change data</h2>
          <form className="form-inline" onSubmit={e => updateData(e)}>
            <input
              type="text"
              className="form-control"
              placeholder="data"
            />
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit
    </button>
          </form>
        </div>

      </div>}

    </div>
  );
}

export default App;
