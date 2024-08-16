import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    // Fetch balance for each address
    const fetchBalances = async () => {
      const newBalances = {};
      for (const address of addresses) {
        const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/f1427e1e8e7a493ca7a882fdc5bb1176");
        const balance = await provider.getBalance(address);
        newBalances[address] = ethers.formatEther(balance);
      }
      setBalances(newBalances);
    };

    if (addresses.length > 0) {
      fetchBalances();
    }
  }, [addresses]);

  return (
    <div>
      <h2>Ethereum Wallets</h2>
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0/0`;
          const wallet = HDNodeWallet.fromSeed(seed).derivePath(derivationPath);
          const newAddress = wallet.address;

          setAddresses([...addresses, newAddress]);
          setCurrentIndex(currentIndex + 1);
        }}
      >
        Generate Wallet
      </button>
      <ul>
        {addresses.map((address, index) => (
          <li key={index}>
            {address} - Balance: {balances[address] || "Fetching..."}
          </li>
        ))}
      </ul>
    </div>
  );
};