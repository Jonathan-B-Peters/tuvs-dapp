import { BeaconWallet } from '@taquito/beacon-wallet';

import { PREFERRED_NETWORK_TYPE, REACT_APP_TEZOS_RPC_URL } from './globals.js';

const wallet = new BeaconWallet({
    name: "Tezos User Verification System",
    preferredNetwork: PREFERRED_NETWORK_TYPE,
    colorMode: 'dark'
});

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

export {
    getActiveAccount,
    disconnect,
    clearActiveAccount,
    getNetworkPermission
};