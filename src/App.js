import React from 'react';
import { TezosToolkit } from '@taquito/taquito';
import './App.css';
import { REACT_APP_TEZOS_RPC_URL, NFT_CONTRACT_ADDRESS } from './globals'
import { useContract } from './hooks/use-contract';
import { useWallet } from './hooks/use-wallet';
import { useState, useEffect } from 'react';
import Identity from './Identity'

const welcomeMessage = 
  <p className="subtitle">
    Welcome to the home of the Tezos User Verification System.
    Here, you can create and manage your digital identity. With
    your permission, other web applications can write new data to your
    digital identity. To see the system in action, checkout the
    game <a href="https://main.d1hhkb9bmopsk1.amplifyapp.com/">Tez-Snake</a>.
  </p>

const noEntryMessage = 
  <p className="subtitle centered">
    Your identity has been created! There just aren't any entries yet. Check
    out <a href="https://main.d1hhkb9bmopsk1.amplifyapp.com/" target="_blank">Tez-Snake</a> to
    start using your new digital identity!
  </p>

const noIdMessage = 
  <p className="subtitle centered" >
    Looks like you have not created an identity yet! Click the button
    below to create a new identity for this wallet address.
  </p>

function App() {

  const [owned, setOwned] = useState([]);
  const [pageState, setPageState] = useState("Home");
  const [parsing, setParsing] = useState(false);
  const [awaiting, setAwaiting] = useState(false);

  const tezos = new TezosToolkit(REACT_APP_TEZOS_RPC_URL)

  const {
    initialized,
    address,
    error: walletError,
    loading: walletLoading,
    wallet,
    connect: connectToWallet,
  } = useWallet(tezos);
  const {
    storage,
    error: contractError,
    loading: contractLoading,
    contract,
    operationsCount,
    connect: connectToContract,
    increaseOperationsCount,
  } = useContract(tezos);

  useEffect(() => {
    connectToContract();
  }, [])

  useEffect(() => {
    parseStorage();
  }, [storage, address]);

  async function mint() {
    tezos.setWalletProvider(wallet);
    tezos.wallet
      .at(NFT_CONTRACT_ADDRESS)
      .then((contract) => contract.methods.mint_id([address]).send())
      .then((op) => {
        setAwaiting(true);
        return op.confirmation();
      })
      .then((result) => {
        if(result.completed) {
          setAwaiting(false);
        }
        else {
          alert("Error :(");
        }
      })
      .finally(() => {
        connectToContract();
      })
      .catch((err) => alert(JSON.stringify(err)));
  }

  async function parseStorage() {
    if(!storage || !wallet) {
      return;
    }
    try {
      setParsing(true);
      console.log("parsing storage");
      let numTokens = await storage.next_token_id;
      let o = [];
      for(let i = 0; i < numTokens; i++) {
        if(await storage.ledger.get(`${i}`) === address) {
          console.log("pushing");
          // let entry = storage.metadata.get(`${i}`);
          // storage.metadata.get(`${i}`).map((item, i) => {
          //   o.push(item);
          // })
          // console.log(typeof(entry[0]));
          // if(entry) {
          //   console.log("entry found");
          //   o.push(entry.title)
          // }
          const md = await storage.metadata.get(`${i}`);
          // md.forEach((entry, i) => {
          //   console.log(entry.title)
          // })
          // const entry = await md.get("First Entry!");
          // console.log(entry.nats[0]);
          o.push(md);
        }
      }
      setOwned(o);
    } catch (e) {
      alert(e);
    }
    setParsing(false);
  }

  function goHome() {
    setPageState("Home");
  }

  function goAbout() {
    setPageState("About");
  }

  return (
    <div>
      <header>
        <div class="headerContent">
          <div class="logo" onClick={goHome}></div>
          <div class="headerWrapper">
            <a class="navigation" href="https://github.com/Jonathan-B-Peters/tuvs-dapp" target="_blank">Source Code</a>
          </div>
        </div>
      </header>
      <div class="body">
        <div class="card"><div class="overlay"></div></div>
        { pageState === "Home" &&
          <div class="wrapper">
            <div class="column">
              <h1 class="title"><span class="heavy">Tezos </span>User Verification System</h1>
              {welcomeMessage}
            </div>
            <div class="dataContainer">
              <div class="phrase">Your digital identity, in your hands.</div>
            </div>
            <div class="buttonContainer">
              <button onClick={connect}>Connect Wallet</button>
            </div>
            {/* <div>{walletError && <p>Wallet error: {walletError}</p>}</div> */}
            {/* <div>{contractError && <p>Contract error: {contractError}</p>}</div> */}
            {parsing && <div class="dataContainer"><h1>Loading...</h1></div>}
            {console.log(owned)}
            {initialized && !parsing && owned.length == 0 && 
              <div>
                <div class="buttonContainer">{noIdMessage}</div>
                <div class="buttonContainer"> <button onClick={mint}>Create Identity</button> </div>
              </div>
            }
            {awaiting && <div class="buttonContainer"><div class="phrase">Minting...</div></div>}
            {initialized && !parsing && owned.length > 0 && !owned[0] &&
              <div class="buttonContainer">{noEntryMessage}</div>
            }
            <div class="idContainer">
              {owned[0] && <Identity entries={owned[0]}/>}
            </div>
          </div>
        }
      </div>
    </div>
  );

  async function connect() {
    await connectToWallet();
    await parseStorage();
  }
}

export default App;
