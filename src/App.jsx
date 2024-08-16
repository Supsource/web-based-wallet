import { useState } from "react";
import "./App.css";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <>
      <h1>Web-Based Wallet</h1>

      {/* Button to generate a new mnemonic */}
      <button
        onClick={async function () {
          const mn = await generateMnemonic();
          setMnemonic(mn);
        }}
      >
        Create Seed Phrase
      </button>

      {/* Display the mnemonic in an input box */}
      <input type="text" value={mnemonic} readOnly />

      {/* Display the Solana Wallet Component */}
      {mnemonic && <SolanaWallet mnemonic={mnemonic} />}

      {/* Display the Ethereum Wallet Component */}
      {mnemonic && <EthWallet mnemonic={mnemonic} />}
    </>
  );
}

export default App;
