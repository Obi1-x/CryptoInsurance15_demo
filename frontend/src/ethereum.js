// use to interact to Metamask which we will use to manage ethereum
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
// import SimpleStorage from './contracts/SimpleStorage.json';
import _Insurengine from './contracts/_Insurengine.json';

const getBlockchain = () =>
    new Promise(async (resolve, reject) => {
        let provider = await detectEthereumProvider();
        if (provider) {
            console.log('provider', provider);
            await provider.request({ method: 'eth_requestAccounts' });
            const networkId = await provider.request({ method: 'net_version' })
            provider = new ethers.providers.Web3Provider(provider);
            const signer = provider.getSigner();
            /*  to check a user address
            ethereum.selectedAddress. */
            if (_Insurengine.networks[networkId]) {
                const _insurengine = new Contract(
                    _Insurengine.networks[networkId].address,
                    _Insurengine.abi,
                    signer // this will help us send transaction thereby making our communication to be secure
                );
                console.log('{ _insurengine }', { _insurengine }, _Insurengine.networks[networkId].address);
                resolve({ _insurengine });
                return;
            } else {
                const _insurengine = { data: 'Select Required Metamask network' };
                console.log('{ _insurengine }', { _insurengine });
                // console.log(ethereum.isMetaMask);
                resolve({ _insurengine });
                return;
            }

        }
        reject('Install Metamask');
    });

export default getBlockchain;
