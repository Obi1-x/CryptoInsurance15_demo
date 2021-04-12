import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import env from './env';
import './App.css';

// interface inputDataMsg {
//   username: string;
//   prevState: undefined
// }



function App() {
  const [hashsurance, setHashsurance] = useState<any | undefined>(undefined);
  const [data, setData] = useState<string | undefined>(undefined);
  const [tokenName, setTokenName] = useState(undefined) as any;
  const [bscState, setBscState] = useState(false);

  useEffect(() => {
    console.log('env', env.api);
    const init = async () => {
      const { hashsurance } = await getBlockchain();
      if (hashsurance.checkNetwork() === false) {
        setHashsurance(hashsurance);
        setData('Select Binance Smart Chain Test Network Required');
        return;
      }

      const dataTest = await Promise.all([hashsurance.checkNetwork(), hashsurance.totalSupply(), hashsurance.getTokenName()])
      console.log('dataTest', dataTest[0], dataTest[1]["_hex"], dataTest[2]);

      setHashsurance(hashsurance);
      setData(Number(dataTest[1]["_hex"]).toString());
      setTokenName(dataTest[2]);
      setBscState(dataTest[0]);
    };
    init();
  }, []);

  const updateData = async (e: any) => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    console.log('data', e.target.elements[0].value, e.target.elements[1].value);

    const tx = await hashsurance.transfer(data);
    await tx.wait();
    const newData = await hashsurance.readData();
    setData(newData);
  };


  if (
    (typeof hashsurance === 'undefined'
      || typeof data === 'undefined')
  ) {
    const loadingData = <div>Loading...</div>;
    console.log(hashsurance, data);
    return loadingData;
  }

  return (
    <div className='container'>
      {/* if Metamask not selected prompt message */}
      {bscState === false && <div className="row">
        <div>{data}</div>
        {/* <div>Token quantity is: {tokenName}</div> */}
      </div>}

      {/* if Metamask is selectected */}
      {bscState === true && <div className='row'>
        <div className='col-sm-6'>
          <h2>Token name is: {tokenName}</h2>
          <p>Token quantity is: {data}</p>
        </div>

        <div className='col-sm-6'>
          <h2>Change data</h2>
          <form className="form-inline" onSubmit={e => updateData(e)}>
            <input
              type="text" name="_address"
              className="form-control"
              placeholder="token address"
            />
            <input
              type="text" name="_value"
              className="form-control"
              placeholder="token quantity"
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
