import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const newBalances = {};
        
    
        const connection = new Connection("https://api.mainnet-beta.solana.com"); 
        
        for (const publicKey of publicKeys) {
          let balance;
          try {
            balance = await connection.getBalance(new PublicKey(publicKey));
          } catch (error) {
            console.error("Error fetching balance:", error);
            balance = 0; 
          }
          newBalances[publicKey] = balance / 1e9; 
        }

        setBalances(newBalances);
      } catch (error) {
        console.error("General error fetching Solana balances:", error);
      }
    };

    if (publicKeys.length > 0) {
      fetchBalances();
    }
  }, [publicKeys]);

  return (
    <div>
      <h2>Solana Wallets</h2>
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivedSeed = derivePath(`m/44'/501'/${currentIndex}'/0'`, seed).key;
          const keypair = Keypair.fromSeed(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey.slice(0, 32));

          const newPublicKey = keypair.publicKey.toBase58();
          console.log("Generated Public Key:", newPublicKey);
          setPublicKeys([...publicKeys, newPublicKey]);
          setCurrentIndex(currentIndex + 1);
        }}
      >
        Generate Wallet
      </button>
      <ul>
        {publicKeys.map((publicKey, index) => (
          <li key={index}>
            {publicKey} - Balance: {balances[publicKey] !== undefined ? `${balances[publicKey]} SOL` : "Fetching..."}
          </li>
        ))}
      </ul>
    </div>
  );
}
