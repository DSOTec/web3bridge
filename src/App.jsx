import { useState } from "react";
import abi from "../src/component/abi.json";
import { ethers } from "ethers";

const contractAddress = "0x2F0320795EeBeA6D1c2dcBB2aa3330AEb21abca0";

function App() {
  const [text, setText] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">Set Message on Smart Contract</h1>
        <input
          type="text"
          placeholder="Set message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 mb-4 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 text-lg transition"
        />
        <button
          onClick={handleSet}
          className="w-full bg-green-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg text-lg shadow transition"
        >
          Set Message
        </button>
      </div>
    </div>
  );
}

export default App;