import { useState } from "react";
import abi from "../src/component/abi.json";
import { ethers } from "ethers";

const contractAddress = "0x2F0320795EeBeA6D1c2dcBB2aa3330AEb21abca0";


function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
    

  

  // Fetch message from contract
  const getMessage = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const msg = await contract.getMessage();
        setMessage(msg);
      } else {
        alert("MetaMask not found.");
      }
    } catch (error) {
      alert("Error fetching message: " + (error.message || error));
    }
  };

  // Set message and fetch after transaction
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
        // Fetch the message after successful transaction
        await getMessage();
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-100 to-emerald-200 px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-lg flex flex-col items-center border border-emerald-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700 mb-8 text-center tracking-tight drop-shadow-sm">Set Message on Smart Contract</h1>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMessage("");
          }}
          className="w-full px-5 py-3 mb-6 border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 text-lg shadow-sm transition-all duration-200 bg-emerald-50/60 placeholder:text-emerald-400"
          autoFocus
        />
        <div className="flex w-full gap-4 mb-2">
          <button
            onClick={handleSet}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-2.5 rounded-xl text-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
          >
            Set Message
          </button>
          <button
            onClick={getMessage}
            className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-2.5 rounded-xl text-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
          >
            Get Message
          </button>
        </div>
        {message && (
          <div className="w-full mt-8 p-5 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center break-words shadow-inner animate-fade-in">
            <span className="font-semibold text-emerald-700">Current Message:</span>
            <div className="mt-2 text-lg font-mono text-emerald-900">{message}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;