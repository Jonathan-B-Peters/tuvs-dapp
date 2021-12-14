import logo from './logo.svg';
import './App.css';

import {
  getActiveAccount,
  disconnect,
  clearActiveAccount,
  getNetworkPermission
} from './tezos.js'

function App() {

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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={async () => {
          await connectWalletHandler()
        }
        }>Link Wallet</button>
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
