'use strict';
const crypto = require('crypto');

const hmacMessage = (seed, cursor = 0) =>
  `${seed.clientSeed}:${seed.nonce}:${cursor}`;

const hmacDigest = (seed, cursor = 0) =>
  crypto
    .createHmac('sha256', seed.serverSeed)
    .update(hmacMessage(seed, cursor))
    .digest();

function* floatGenerator(seed, startCursor = 0, startOffset = 0) {
  let cursor = startCursor;
  let offset = startOffset;

  while (true) {
    const buffer = hmacDigest(seed, cursor);

    for (let i = offset; i + 4 <= buffer.length; i += 4) {
      const int = buffer.readUInt32BE(i);
      yield int / 0x100000000;
    }
    cursor++;
    offset = 0;
  }
}

const provablyFair = (seed, floatIndex) => {
  const startOffset = floatIndex ? (floatIndex % 8) * 4 : 0;
  const startCursor = floatIndex ? Math.floor(floatIndex / 8) : 0;

  const rng = floatGenerator(seed, startCursor, startOffset);

  function generateFloats(count) {
    return Array.from({ length: count }, () => rng.next().value);
  }

  return {
    generateFloats,
    generateFloat: () => generateFloats(1)[0],
  };
};

const hashSeed = (seed) =>
  crypto.createHash('SHA256').update(seed).digest('hex');

const generateServerSeed = () => {
  const length = 64;
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  return bytes.toString('hex').slice(0, length);
};

module.exports = {
  floatGenerator,
  provablyFair,
  hmacMessage,
  hmacDigest,
  hashSeed,
  generateServerSeed,
};
