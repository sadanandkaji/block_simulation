import React, { useEffect, useState } from "react";
import Block from "./block";
import "./App.css";

function App() {
  const [blockchain, setBlockchain] = useState([]);
  const [blockValidity, setBlockValidity] = useState([]);
  const [difficulty, setDifficulty] = useState(4);
  const defaultPublicKey = "0x0000->0x0000";

  useEffect(() => {
    const block1 = new Block(
      1,
      new Date().toISOString(),
      { amount: 0, to: defaultPublicKey },
      "0",
      difficulty
    );
    const block2 = new Block(
      2,
      new Date().toISOString(),
      { amount: 0, to: defaultPublicKey },
      block1.hash,
      difficulty
    );
    const block3 = new Block(
      3,
      new Date().toISOString(),
      { amount: 0, to: defaultPublicKey },
      block2.hash,
      difficulty
    );

    const initialChain = [block1, block2, block3];
    setBlockchain(initialChain);
    setBlockValidity(validateChain(initialChain, difficulty));
  }, []);

  const validateChain = (chain, difficulty) => {
    const prefix = "0".repeat(difficulty);
    return chain.map((block, i) => {
      const isHashValid = block.hash.startsWith(prefix);
      const isPrevValid = i === 0 || block.previousHash === chain[i - 1].hash;
      return isHashValid && isPrevValid;
    });
  };

  const handleChange = (index, field, value) => {
    setBlockchain((prevChain) => {
      const newChain = [...prevChain];

      for (let i = index; i < newChain.length; i++) {
        if (i === index) {
          const newData = {
            ...newChain[i].data,
            [field]: field === "amount" ? Number(value) : value,
          };
          newChain[i].updateData(newData);
        } else {
          newChain[i].previousHash = newChain[i - 1].hash;
          newChain[i].hash = newChain[i].calculateHash();
          newChain[i].nonce = 0;
          newChain[i].miningTime = null;
        }
      }

      setBlockValidity(validateChain(newChain, difficulty));
      return newChain;
    });
  };

  const mineBlockAtIndex = (index) => {
    setBlockchain((prevChain) => {
      const newChain = [...prevChain];
      newChain[index].mineBlock(difficulty);

      for (let i = index + 1; i < newChain.length; i++) {
        newChain[i].previousHash = newChain[i - 1].hash;
        newChain[i].hash = newChain[i].calculateHash();
        newChain[i].nonce = 0;
        newChain[i].miningTime = null;
      }

      setBlockValidity(validateChain(newChain, difficulty));
      return newChain;
    });
  };

  return (
    <div className="p-6 md:p-12 flex flex-col items-center bg-black min-h-screen">
      <h1 className="w-full text-3xl font-bold text-center mb-4 text-green-500">
        Blockchain Simulation
      </h1>

      <div className="w-full max-w-md mx-auto text-white text-center mb-6">
        <div className="flex justify-center">
          <div className="flex items-center text-white">
            <span className="pr-3 font-semibold">Difficulty:</span>
            <input
              type="number"
              min="1"
              max="7"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="w-20 text-center px-3 py-1 rounded-md text-white bg-gray-800 border border-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-8">
        {blockchain.map((block, idx) => (
          <div
            key={idx}
            className={`w-full max-w-md p-4 rounded-xl shadow-xl bg-gray-900 text-white flex flex-col justify-between items-center border-4 ${
              blockValidity[idx] ? "border-green-500" : "border-red-500"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">Block #{block.index}</h2>

            <h3 className="text-lg font-semibold mb-2">Data</h3>

            <label className="mb-3 w-full">
              <span className="block text-sm mb-1">Amount:</span>
              <input
                type="number"
                onChange={(e) => handleChange(idx, "amount", e.target.value)}
                placeholder="btc"
                className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300"
              />
            </label>

            <label className="mb-3 w-full">
              <span className="block text-sm mb-1">Transaction:</span>
              <input
                type="text"
                value={block.data.to}
                onChange={(e) => handleChange(idx, "to", e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300"
              />
            </label>

            <div className="border-b border-gray-500 w-full my-2 font-bold"></div>

            <p className="text-xs break-words">
              <strong>Previous Hash:</strong> {block.previousHash}
            </p>

            <p className="text-xs break-words mt-1 ml-3 font-bold">
              <strong>Hash:</strong>{" "}
              <span
                className={`font-mono ${
                  block.hash.startsWith("0".repeat(difficulty))
                    ? "text-green-300"
                    : "text-red-400"
                }`}
              >
                {block.hash}
              </span>
            </p>

            <p className="mt-2">
              <strong>Nonce:</strong> {block.nonce}
            </p>

            <div className="border-b border-gray-500 w-full my-2"></div>

            <button
              onClick={() => mineBlockAtIndex(idx)}
              className="mt-4 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 font-semibold"
            >
              ⛏️ Mine Block
            </button>

            {block.miningTime !== null && (
              <p className="mt-2 text-sm font-mono text-gray-400">
                ⏱️ Mined in: {block.miningTime.toFixed(6)} ms
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
