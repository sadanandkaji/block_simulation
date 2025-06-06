import SHA256 from "crypto-js/sha256";

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.miningTime = null; // will hold mining time in ms
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

mineBlock() {
  const prefix = "0000";

  this.nonce = 0;
  this.hash = this.calculateHash(); // recalculate from nonce 0

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
    this.nonce = 0; // reset nonce since data changed
    this.miningTime = null; // mining needed again
  }
}

export default Block;
