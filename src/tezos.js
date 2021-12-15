import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import {
    PREFERRED_NETWORK_TYPE, 
    NFT_CONTRACT_ADDRESS,
    REACT_APP_TEZOS_RPC_URL
} from './globals.js';

const Tezos = new TezosToolkit(REACT_APP_TEZOS_RPC_URL);

const wallet = new BeaconWallet({
    name: "Tezos User Verification System",
    preferredNetwork: PREFERRED_NETWORK_TYPE,
    colorMode: 'dark'
});

Tezos.setWalletProvider({ wallet });
Tezos.setProvider({ wallet });

const network = {
    type: PREFERRED_NETWORK_TYPE,
    rpcUrl: REACT_APP_TEZOS_RPC_URL
}

const clearActiveAccount = () => {
    wallet.clearActiveAccount();
};

const disconnect = () => {
    wallet.disconnect();
}

const getActiveAccount = async () => {
    return await wallet.client.getActiveAccount();
};

const getNetworkPermission = async () => {
    var activeAccount = await getActiveAccount();

    if(!activeAccount) {
        await wallet.requestPermissions({network});
        activeAccount = getActiveAccount;
    }

    return activeAccount;
}

const getTokenContract = async () => {
    let contract;
    try {
        contract = await Tezos.contract.at(NFT_CONTRACT_ADDRESS);
    } catch (error) {
        alert("CONTRACT ERROR: " + JSON.stringify(error));
    }
    return contract;
}

export {
    getActiveAccount,
    disconnect,
    clearActiveAccount,
    getNetworkPermission,
    getTokenContract
};