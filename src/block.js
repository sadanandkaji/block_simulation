import SHA256 from "crypto-js/sha256";

class Block {
  constructor(index, timestamp, data, previousHash = "", difficulty = 4) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.difficulty = difficulty; // 🔥 Store difficulty
    this.hash = this.calculateHash();
    this.miningTime = null;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty = this.difficulty) {
    const prefix = "0".repeat(difficulty);

    this.nonce = 0;
    this.hash = this.calculateHash();

    const startTime = performance.now();

    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const endTime = performance.now();
    this.miningTime = endTime - startTime;
    console.log(`Block mined in ${this.miningTime.toFixed(6)} ms`);
  }

  updateData(newData) {
    this.data = newData;
    this.hash = this.calculateHash();
    this.nonce = 0;
    this.miningTime = null;
  }
}

export default Block;
