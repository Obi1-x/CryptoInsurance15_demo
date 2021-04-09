// use to interact to Metamask which we will use to manage ethereum
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
// import SimpleStorage from './contracts/SimpleStorage.json';
import Hashsurance from './contracts/Hashsurance.json';

const getBlockchain = () =>
    new Promise(async (resolve, reject) => {
        let provider = await detectEthereumProvider();
        if (provider) {
            console.log('provider', provider);
            await provider.request({ method: 'eth_requestAccounts' });
            const networkId = await provider.request({ method: 'net_version' })
            provider = new ethers.providers.Web3Provider(provider);
            const signer = provider.getSigner();
            if (Hashsurance.networks[networkId]) {
                const hashsurance = new Contract(
                    Hashsurance.networks[networkId].address,
                    Hashsurance.abi,
                    signer // this will help us send transaction thereby making our communication to be secure
                );
                console.log('{ hashsurance }', { hashsurance });
                resolve({ hashsurance });
                return;
            } else {
                const hashsurance = { data: 'Select Required Metamask network' };
                console.log('{ hashsurance }', { hashsurance });
                resolve({ hashsurance });
                return;
            }

        }
        reject('Install Metamask');
    });

export default getBlockchain;
