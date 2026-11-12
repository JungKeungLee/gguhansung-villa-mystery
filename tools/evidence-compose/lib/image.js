// 외부 패키지 없이 PNG·WebP 크기를 읽고, 파일 해시를 계산한다.
'use strict';
const fs = require('fs'), crypto = require('crypto');

function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { type: 'png', width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const c = b.toString('ascii', 12, 16);
    if (c === 'VP8X') return { type: 'webp', width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (c === 'VP8 ') return { type: 'webp', width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (c === 'VP8L') { const n = b.readUInt32LE(21); return { type: 'webp', width: (n & 0x3fff) + 1, height: ((n >> 14) & 0x3fff) + 1 }; }
  }
  throw new Error('PNG 또는 WebP 파일이 아닙니다: ' + file);
}

const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

module.exports = { imageSize, sha256 };
