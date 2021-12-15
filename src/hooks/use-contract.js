import { ContractAbstraction, MichelsonMap, TezosToolkit } from '@taquito/taquito';
import React, { useState, useEffect } from 'react'
import { NFT_CONTRACT_ADDRESS } from '../globals';
import { BeaconWallet } from '@taquito/beacon-wallet'
import { useWallet } from './use-wallet'

export function useContract(tezos, address) {
    const [contract, setContract] = useState(null);
    const [error, setError] = useState("");
    const [storage, setStorage] = useState();
    const [owned, setOwned] = useState([]);
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(false);
    const [operationsCount, setOperationsCounter] = useState(0);

    useEffect(() => {
        loadStorage(contract);
    }, [contract, operationsCount]);

    useEffect(() => {
        parseStorage(storage);
    }, [storage, address, operationsCount]);

    return {
        contract,
        error,
        storage,
        owned,
        loading,
        operationsCount,
        connect,
        increaseOperationsCount,
    };

    function increaseOperationsCount() {
        setOperationsCounter(operationsCount + 1);
    }

    async function connect() {
        setLoading(true);
        try {
            const contractInstance = await tezos.contract.at(NFT_CONTRACT_ADDRESS);
            setContract(contractInstance);
            increaseOperationsCount();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadStorage(contract) {
        if(!contract) {
            return;
        }
        try {
            setLoading(true);
            const storage = await contract.storage();
            setStorage(storage);
            // alert(await storage.ledger.get('0'));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function parseStorage(storage) {
        if(!storage) {
            return;
        }
        try {
            let numTokens = await storage.next_token_id.c;
            let o = [];
            for(let i = 0; i < numTokens; i++) {
                if(await storage.ledger.get(`${i}`) === address) {
                    o.push(i)
                }
            }
            o.push(address);
            setOwned(o);
        } catch (e) {
            alert(e);
        }
    }
}