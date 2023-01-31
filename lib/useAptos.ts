import { useState, useEffect } from 'react';
import { Types, AptosClient } from 'aptos';

const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

declare global {
  interface Window {
    aptos: any;
  }
}

function useAptos() {
  const [address, setAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<Types.AccountData | null>(null);

  /**
   * init function
   */
  const connect = async () => {
    // connect
    if (!window?.aptos) return;
    const { address, publicKey } = await window.aptos.connect();
    setAddress(address);
    // client.getAccount(address).then(setAccount);
  };

  useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
  }, [address]);

  return {
    connect,
    address,
    account,
  };
}

export { useAptos };
