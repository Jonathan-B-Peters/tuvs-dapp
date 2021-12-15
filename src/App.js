import React from 'react';
import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import './App.css';
import { REACT_APP_TEZOS_RPC_URL } from './globals'
import { useContract } from './hooks/use-contract';
import { useWallet } from './hooks/use-wallet';
import { useState } from 'react';

// import {
//   getActiveAccount,
//   disconnect,
//   clearActiveAccount,
//   getNetworkPermission,
//   getTokenContract
// } from './tezos.js'
import { useEffect } from 'react';

function App() {

  const tezos = new TezosToolkit(REACT_APP_TEZOS_RPC_URL)

  const {
    initialized,
    address,
    error: walletError,
    loading: walletLoading,
    connect: connectToWallet,
  } = useWallet(tezos);
  const {
    storage,
    owned,
    error: contractError,
    loading: contractLoading,
    contract,
    operationsCount,
    connect: connectToContract,
    increaseOperationsCount,
  } = useContract(tezos, address);

  async function mint() {
    try {
        alert(await tezos.wallet.pkh());
        const op = await contract.methods.mint([await tezos.wallet.pkh]).send();
        // await op.confirmation();
    } catch(e) {
        alert("error: " + JSON.stringify(e));
    }
  }
  
  //Need to configure signer for this
  //Not just pass address
  //I think
  //Or is that what I already did?
  //Or did I not get the right permissions?

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connect}>Connect</button>
        <button onClick={mint}>Mint</button>
        {/* <div>
          Next Token ID: {JSON.stringify(storage.next_token_id.c)}
        </div>
        <div>
          {owned.map((item, i) => {
            return <div>Owner: {item} </div>;
          })}
        </div> */}
      </header>
    </div>
  );

  async function connect() {
    await connectToContract();
    await connectToWallet();
  }
}

export default App;
