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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">Set Message on Smart Contract</h1>
        <input
          type="text"
          placeholder="Set message"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMessage("");
          }}
          className="w-full px-4 py-2 mb-4 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 text-lg transition"
        />
        <div className="flex w-full gap-4">
          <button
            onClick={handleSet}
            className="flex-1 bg-green-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg text-lg shadow transition"
          >
            Set Message
          </button>
          <button
            onClick={getMessage}
            className="flex-1 bg-red-600 hover:bg-wine-700 text-white font-semibold py-2 rounded-lg text-lg shadow transition"
          >
            Get Message
          </button>
        </div>
        {message && (
          <div className="w-full mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center break-words">
            <span className="font-semibold">Current Message:</span> {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;