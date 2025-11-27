// Streams Module - Advanced Real-world Examples
// ==============================================

const { Transform, pipeline, Readable } = require('stream');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

console.log('=== Streams Advanced Examples ===\n');

// Example 1: File Compression using Streams
// ------------------------------------------
console.log('১. File Compression (gzip):');
console.log('─'.repeat(50));

const inputFile = path.join(__dirname, 'test-data', 'large-file.txt');
const compressedFile = path.join(__dirname, 'output', 'compressed.txt.gz');

console.log('Compressing file...');

const startTime = Date.now();
let bytesRead = 0;

fs.createReadStream(inputFile)
  .on('data', (chunk) => {
    bytesRead += chunk.length;
  })
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(compressedFile))
  .on('finish', () => {
    const endTime = Date.now();
    const originalSize = fs.statSync(inputFile).size;
    const compressedSize = fs.statSync(compressedFile).size;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    
    console.log('✅ Compression complete!');
    console.log(`  Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Compression ratio: ${ratio}%`);
    console.log(`  Time taken: ${endTime - startTime}ms\n`);
  })
  .on('error', (err) => {
    console.error('Compression error:', err.message);
  });

// Example 2: File Decompression
// ------------------------------
setTimeout(() => {
  console.log('২. File Decompression:');
  console.log('─'.repeat(50));
  
  const decompressedFile = path.join(__dirname, 'output', 'decompressed.txt');
  
  console.log('Decompressing file...');
  
  fs.createReadStream(compressedFile)
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(decompressedFile))
    .on('finish', () => {
      console.log('✅ Decompression complete!');
      console.log('  File:', decompressedFile, '\n');
    })
    .on('error', (err) => {
      console.error('Decompression error:', err.message);
    });
}, 2000);

// Example 3: File Encryption using Streams
// -----------------------------------------
setTimeout(() => {
  console.log('৩. File Encryption (AES-256):');
  console.log('─'.repeat(50));
  
  const algorithm = 'aes-256-cbc';
  const password = 'my-secret-password-12345678901234'; // 32 chars
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(password),
    iv
  );
  
  const plainFile = path.join(__dirname, 'test-data', 'small-file.txt');
  const encryptedFile = path.join(__dirname, 'output', 'encrypted.txt');
  
  console.log('Encrypting file...');
  
  // Save IV for decryption later
  fs.writeFileSync(
    path.join(__dirname, 'output', 'encryption-iv.txt'),
    iv.toString('hex')
  );
  
  fs.createReadStream(plainFile)
    .pipe(cipher)
    .pipe(fs.createWriteStream(encryptedFile))
    .on('finish', () => {
      console.log('✅ Encryption complete!');
      console.log('  Encrypted file:', encryptedFile);
      console.log('  IV saved for decryption\n');
    });
}, 3000);

// Example 4: File Decryption
// ---------------------------
setTimeout(() => {
  console.log('৪. File Decryption:');
  console.log('─'.repeat(50));
  
  const algorithm = 'aes-256-cbc';
  const password = 'my-secret-password-12345678901234';
  
  // Load IV
  const ivHex = fs.readFileSync(
    path.join(__dirname, 'output', 'encryption-iv.txt'),
    'utf8'
  );
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(password),
    iv
  );
  
  const encryptedFile = path.join(__dirname, 'output', 'encrypted.txt');
  const decryptedFile = path.join(__dirname, 'output', 'decrypted.txt');
  
  console.log('Decrypting file...');
  
  fs.createReadStream(encryptedFile)
    .pipe(decipher)
    .pipe(fs.createWriteStream(decryptedFile))
    .on('finish', () => {
      console.log('✅ Decryption complete!');
      console.log('  Decrypted file:', decryptedFile, '\n');
    })
    .on('error', (err) => {
      console.error('Decryption error:', err.message);
    });
}, 4000);

// Example 5: Progress Tracker Transform
// --------------------------------------
setTimeout(() => {
  console.log('৫. File Copy with Progress Bar:');
  console.log('─'.repeat(50));
  
  class ProgressTransform extends Transform {
    constructor(totalSize) {
      super();
      this.totalSize = totalSize;
      this.bytesProcessed = 0;
      this.lastPercent = 0;
    }
    
    _transform(chunk, encoding, callback) {
      this.bytesProcessed += chunk.length;
      const percent = Math.floor((this.bytesProcessed / this.totalSize) * 100);
      
      if (percent !== this.lastPercent && percent % 10 === 0) {
        const bar = '█'.repeat(percent / 5) + '░'.repeat(20 - percent / 5);
        process.stdout.write(`\r  Progress: [${bar}] ${percent}%`);
        this.lastPercent = percent;
      }
      
      this.push(chunk);
      callback();
    }
    
    _flush(callback) {
      process.stdout.write('\r  Progress: [████████████████████] 100%\n');
      callback();
    }
  }
  
  const source = path.join(__dirname, 'test-data', 'large-file.txt');
  const dest = path.join(__dirname, 'output', 'copy-with-progress.txt');
  
  const fileSize = fs.statSync(source).size;
  
  fs.createReadStream(source)
    .pipe(new ProgressTransform(fileSize))
    .pipe(fs.createWriteStream(dest))
    .on('finish', () => {
      console.log('✅ Copy with progress complete!\n');
    });
}, 5000);

// Example 6: Pipeline API (Error Handling)
// -----------------------------------------
setTimeout(() => {
  console.log('৬. Pipeline API (Better Error Handling):');
  console.log('─'.repeat(50));
  
  const { pipeline } = require('stream');
  const { promisify } = require('util');
  const pipelineAsync = promisify(pipeline);
  
  (async () => {
    const source = path.join(__dirname, 'test-data', 'small-file.txt');
    const dest = path.join(__dirname, 'output', 'pipeline-output.txt');
    
    try {
      await pipelineAsync(
        fs.createReadStream(source),
        new Transform({
          transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
          }
        }),
        fs.createWriteStream(dest)
      );
      
      console.log('✅ Pipeline complete!');
      console.log('  Better error handling than .pipe()\n');
    } catch (err) {
      console.error('Pipeline failed:', err.message);
    }
  })();
}, 6500);

// Example 7: Data Aggregation Stream
// -----------------------------------
setTimeout(() => {
  console.log('৭. Data Aggregation - Word Counter:');
  console.log('─'.repeat(50));
  
  class WordCounter extends Transform {
    constructor() {
      super({ objectMode: true });
      this.wordCount = {};
    }
    
    _transform(chunk, encoding, callback) {
      const words = chunk.toString()
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
      
      words.forEach(word => {
        this.wordCount[word] = (this.wordCount[word] || 0) + 1;
      });
      
      callback();
    }
    
    _flush(callback) {
      // Sort by count
      const sorted = Object.entries(this.wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      this.push({ topWords: sorted, totalWords: Object.keys(this.wordCount).length });
      callback();
    }
  }
  
  const wordCounter = new WordCounter();
  
  wordCounter.on('data', (result) => {
    console.log('Top 10 words:');
    result.topWords.forEach(([word, count], index) => {
      console.log(`  ${index + 1}. "${word}" - ${count} times`);
    });
    console.log(`\nTotal unique words: ${result.totalWords}\n`);
  });
  
  fs.createReadStream(path.join(__dirname, 'test-data', 'large-file.txt'))
    .pipe(wordCounter);
}, 7000);

// Example 8: Stream Multiplexer (Split to Multiple Destinations)
// ---------------------------------------------------------------
setTimeout(() => {
  console.log('৮. Stream Multiplexer (Write to Multiple Files):');
  console.log('─'.repeat(50));
  
  class Multiplexer extends Readable {
    constructor(source) {
      super();
      this.source = source;
      this.destinations = [];
    }
    
    addDestination(dest) {
      this.destinations.push(dest);
    }
    
    _read() {
      // Handled by source
    }
    
    start() {
      this.source.on('data', (chunk) => {
        this.destinations.forEach(dest => {
          dest.write(chunk);
        });
      });
      
      this.source.on('end', () => {
        this.destinations.forEach(dest => {
          dest.end();
        });
        console.log(`✅ Multiplexed to ${this.destinations.length} destinations!\n`);
      });
    }
  }
  
  const source = fs.createReadStream(
    path.join(__dirname, 'test-data', 'small-file.txt')
  );
  
  const multiplexer = new Multiplexer(source);
  
  // Add multiple destinations
  multiplexer.addDestination(
    fs.createWriteStream(path.join(__dirname, 'output', 'copy1.txt'))
  );
  multiplexer.addDestination(
    fs.createWriteStream(path.join(__dirname, 'output', 'copy2.txt'))
  );
  multiplexer.addDestination(
    fs.createWriteStream(path.join(__dirname, 'output', 'copy3.txt'))
  );
  
  console.log('Writing to 3 files simultaneously...');
  multiplexer.start();
}, 8000);

// Example 9: Rate Limited Stream
// -------------------------------
setTimeout(() => {
  console.log('৯. Rate Limited Stream:');
  console.log('─'.repeat(50));
  
  class RateLimitedStream extends Transform {
    constructor(bytesPerSecond) {
      super();
      this.bytesPerSecond = bytesPerSecond;
      this.lastTime = Date.now();
      this.bytesWritten = 0;
    }
    
    _transform(chunk, encoding, callback) {
      const now = Date.now();
      const elapsed = (now - this.lastTime) / 1000;
      
      this.bytesWritten += chunk.length;
      const expectedTime = this.bytesWritten / this.bytesPerSecond;
      
      if (elapsed < expectedTime) {
        const delay = (expectedTime - elapsed) * 1000;
        setTimeout(() => {
          this.push(chunk);
          callback();
        }, delay);
      } else {
        this.push(chunk);
        callback();
      }
    }
  }
  
  console.log('Copying file with rate limit (1KB/sec)...');
  const startTime = Date.now();
  
  fs.createReadStream(path.join(__dirname, 'test-data', 'small-file.txt'))
    .pipe(new RateLimitedStream(1024)) // 1KB per second
    .pipe(fs.createWriteStream(path.join(__dirname, 'output', 'rate-limited.txt')))
    .on('finish', () => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Rate-limited copy complete in ${elapsed}s\n`);
    });
}, 9000);

setTimeout(() => {
  console.log('=== Streams Advanced Complete! ===');
}, 11000);