import React, { useEffect, useState } from "react";
import Block from "./block"; // Make sure Block.js is in the same folder or adjust path

function App() {
  const [blockchain, setBlockchain] = useState([]);
  const [blockValidity, setBlockValidity] = useState([]);
  const defaultPublicKey = "0x0000->0x0000";

  useEffect(() => {
    const block1 = new Block(
      1,
      new Date().toISOString(),
      { amount: 0, to: defaultPublicKey },
      "0"
    );
    const block2 = new Block(
      2,
      new Date().toISOString(),
      { amount: 0, to: defaultPublicKey },
      block1.hash
    );
    const block3 = new Block(
      3,
      new Date().toISOString(),
      { amount: 0, to: defaultPublicKey },
      block2.hash
    );

    const initialChain = [block1, block2, block3];
    setBlockchain(initialChain);
    setBlockValidity(validateChain(initialChain));
  }, []);

  const validateChain = (chain) => {
    const prefix = "0000";
    const validity = [];

    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];
      const isHashValid = block.hash.startsWith(prefix);
      const isPrevValid = i === 0 || block.previousHash === chain[i - 1].hash;
      validity.push(isHashValid && isPrevValid);
    }

    return validity;
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

      setBlockValidity(validateChain(newChain));
      return newChain;
    });
  };

  const mineBlockAtIndex = (index) => {
    setBlockchain((prevChain) => {
      const newChain = [...prevChain];

      newChain[index].mineBlock();

      for (let i = index + 1; i < newChain.length; i++) {
        newChain[i].previousHash = newChain[i - 1].hash;
        newChain[i].hash = newChain[i].calculateHash();
        newChain[i].nonce = 0;
      }

      setBlockValidity(validateChain(newChain));
      return newChain;
    });
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {blockchain.map((block, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "20px",
            padding: "30px",
            border: `3px solid ${blockValidity[idx] ? "green" : "red"}`,
            borderRadius: "10px",
            backgroundColor: "#111",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "600px",
            height: "400px",
            boxShadow: "0 0 10px rgba(0,0,0,0.6)",
          }}
        >
          <h2>Block #{block.index}</h2>

          <label style={{ width: "100%", marginBottom: "8px" }}>
            Amount:{" "}
            <input
              type="number"
              value={block.data.amount}
              onChange={(e) => handleChange(idx, "amount", e.target.value)}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "4px",
                border: "none",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ width: "100%", marginBottom: "8px" }}>
            To:{" "}
            <input
              type="text"
              value={block.data.to}
              onChange={(e) => handleChange(idx, "to", e.target.value)}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "4px",
                border: "none",
                fontSize: "1rem",
              }}
            />
          </label>

          <p style={{ wordBreak: "break-all", fontSize: "0.8rem" }}>
            <strong>Previous Hash:</strong> {block.previousHash}
          </p>

          <p style={{ wordBreak: "break-all", fontSize: "0.8rem" }}>
            <strong>Hash:</strong>{" "}
            <span
              style={{
                color: block.hash.startsWith("0000") ? "lightgreen" : "red",
                fontFamily: "monospace",
              }}
            >
              {block.hash}
            </span>
          </p>

          <p>
            <strong>Nonce:</strong> {block.nonce}
          </p>

          <button
            onClick={() => mineBlockAtIndex(idx)}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              marginTop: "10px",
            }}
          >
             Mine Block
          </button>

          {block.miningTime !== null && (
            <p
              style={{
                marginTop: "8px",
                color: "lightgray",
                fontSize: "0.9rem",
                fontFamily: "monospace",
              }}
            >
               Mined in: {block.miningTime.toFixed(6)} ms
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
