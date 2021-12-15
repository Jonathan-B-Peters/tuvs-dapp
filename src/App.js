import React, { useState } from 'react';
import './App.css';

import {
  getActiveAccount,
  disconnect,
  clearActiveAccount,
  getNetworkPermission,
  getTokenContract
} from './tezos.js'

function App() {

  const [storage, setStorage] = useState({});

  let isConnected;

  async function connectWalletHandler() {
    isConnected = await getActiveAccount();
    if(isConnected) {
      disconnect();
      clearActiveAccount();
    } else {
      getNetworkPermission()
    }
    return isConnected;
  }

  async function getContractStorage() {
    try {
      let contract = await getTokenContract();
      let s = await contract.storage();
      setStorage(s);
    } catch (error) {
      alert("STORAGE ERROR");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={async () => {
          await connectWalletHandler();
        }}>Link Wallet</button>
        <button onClick={async () => {
          await getContractStorage();
        }}>Get Storage</button>
        <p>
          Here's the storage: {typeof(storage.ledger)}
        </p>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
