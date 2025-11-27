// Streams Module - Basic Examples
// ================================

const fs = require('fs');
const path = require('path');

console.log('=== Streams Module শিখি ===\n');

// ১. Readable Stream - File পড়া (Chunk by Chunk)
// -------------------------------------------------
console.log('১. Readable Stream - Reading File:');
console.log('─'.repeat(50));

const readStream = fs.createReadStream(
  path.join(__dirname, 'test-data', 'small-file.txt'),
  { encoding: 'utf8' }
);

console.log('Reading file in chunks...\n');

let chunkCount = 0;

readStream.on('data', (chunk) => {
  chunkCount++;
  console.log(`Chunk ${chunkCount}:`);
  console.log(chunk);
  console.log('─'.repeat(30));
});

readStream.on('end', () => {
  console.log(`\n✅ File read complete! Total chunks: ${chunkCount}\n`);
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err.message);
});

// ২. Writable Stream - File লিখা
// --------------------------------
setTimeout(() => {
  console.log('২. Writable Stream - Writing File:');
  console.log('─'.repeat(50));
  
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'output', 'output.txt')
  );
  
  console.log('Writing data to file...\n');
  
  writeStream.write('Line 1: Hello from Streams!\n');
  writeStream.write('Line 2: Writing data chunk by chunk\n');
  writeStream.write('Line 3: This is efficient!\n');
  
  // Write শেষ করো
  writeStream.end('Line 4: Final line\n');
  
  writeStream.on('finish', () => {
    console.log('✅ File write complete!\n');
  });
  
  writeStream.on('error', (err) => {
    console.error('Error writing file:', err.message);
  });
}, 500);

// ৩. Pipe - Readable থেকে Writable এ সরাসরি
// ------------------------------------------
setTimeout(() => {
  console.log('৩. Pipe - Copy File using Streams:');
  console.log('─'.repeat(50));
  
  const source = fs.createReadStream(
    path.join(__dirname, 'test-data', 'small-file.txt')
  );
  
  const destination = fs.createWriteStream(
    path.join(__dirname, 'output', 'copied.txt')
  );
  
  console.log('Copying file using pipe...\n');
  
  // Pipe করো - automatically data transfer হবে
  source.pipe(destination);
  
  destination.on('finish', () => {
    console.log('✅ File copied successfully using pipe!\n');
  });
  
  source.on('error', (err) => {
    console.error('Source error:', err.message);
  });
  
  destination.on('error', (err) => {
    console.error('Destination error:', err.message);
  });
}, 1000);

// ৪. Memory Usage Comparison
// --------------------------
setTimeout(() => {
  console.log('৪. Memory Usage - Stream vs Normal:');
  console.log('─'.repeat(50));
  
  const largeFile = path.join(__dirname, 'test-data', 'large-file.txt');
  
  // Method 1: Normal (readFile) - পুরো file memory তে
  console.log('Method 1: fs.readFile (Load everything in memory)');
  const startMem1 = process.memoryUsage().heapUsed;
  
  fs.readFile(largeFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    
    const endMem1 = process.memoryUsage().heapUsed;
    const used1 = ((endMem1 - startMem1) / 1024 / 1024).toFixed(2);
    
    console.log(`  File size: ${(data.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Memory used: ~${used1} MB`);
    console.log(`  💡 পুরো file memory তে load হয়েছে!\n`);
    
    // Method 2: Stream - শুধু chunks
    setTimeout(() => {
      console.log('Method 2: createReadStream (Process chunks)');
      const startMem2 = process.memoryUsage().heapUsed;
      
      const stream = fs.createReadStream(largeFile, {
        encoding: 'utf8',
        highWaterMark: 64 * 1024 // 64KB chunks
      });
      
      let dataSize = 0;
      
      stream.on('data', (chunk) => {
        dataSize += chunk.length;
      });
      
      stream.on('end', () => {
        const endMem2 = process.memoryUsage().heapUsed;
        const used2 = ((endMem2 - startMem2) / 1024 / 1024).toFixed(2);
        
        console.log(`  File size: ${(dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  Memory used: ~${used2} MB`);
        console.log(`  💡 শুধু chunks memory তে ছিল!\n`);
        
        console.log('🎯 Result: Streams use MUCH less memory!\n');
      });
    }, 100);
  });
}, 1500);

// ৫. Backpressure Handling
// ------------------------
setTimeout(() => {
  console.log('৫. Backpressure - Write Speed Control:');
  console.log('─'.repeat(50));
  
  const readable = fs.createReadStream(
    path.join(__dirname, 'test-data', 'large-file.txt')
  );
  
  const writable = fs.createWriteStream(
    path.join(__dirname, 'output', 'backpressure-test.txt')
  );
  
  readable.on('data', (chunk) => {
    const canWrite = writable.write(chunk);
    
    if (!canWrite) {
      console.log('⚠️  Buffer full! Pausing read stream...');
      readable.pause();
    }
  });
  
  writable.on('drain', () => {
    console.log('✅ Buffer drained! Resuming read stream...');
    readable.resume();
  });
  
  readable.on('end', () => {
    writable.end();
    console.log('✅ Backpressure handling complete!\n');
  });
}, 3000);

// ৬. Stream Options - highWaterMark
// ---------------------------------
setTimeout(() => {
  console.log('৬. Stream Options - Chunk Size Control:');
  console.log('─'.repeat(50));
  
  console.log('Small chunks (16 bytes):');
  const smallChunks = fs.createReadStream(
    path.join(__dirname, 'test-data', 'small-file.txt'),
    { encoding: 'utf8', highWaterMark: 16 }
  );
  
  let smallCount = 0;
  smallChunks.on('data', (chunk) => {
    smallCount++;
    console.log(`  Chunk ${smallCount}: ${chunk.length} bytes`);
  });
  
  smallChunks.on('end', () => {
    console.log(`Total chunks with 16 bytes: ${smallCount}\n`);
    
    // Large chunks
    console.log('Large chunks (1024 bytes):');
    const largeChunks = fs.createReadStream(
      path.join(__dirname, 'test-data', 'small-file.txt'),
      { encoding: 'utf8', highWaterMark: 1024 }
    );
    
    let largeCount = 0;
    largeChunks.on('data', (chunk) => {
      largeCount++;
      console.log(`  Chunk ${largeCount}: ${chunk.length} bytes`);
    });
    
    largeChunks.on('end', () => {
      console.log(`Total chunks with 1024 bytes: ${largeCount}\n`);
    });
  });
}, 4000);

// ৭. Reading Control - pause() and resume()
// ------------------------------------------
setTimeout(() => {
  console.log('৭. Stream Control - pause() and resume():');
  console.log('─'.repeat(50));
  
  const controlStream = fs.createReadStream(
    path.join(__dirname, 'test-data', 'small-file.txt'),
    { encoding: 'utf8' }
  );
  
  let isPaused = false;
  
  controlStream.on('data', (chunk) => {
    console.log('📖 Reading data...');
    
    if (!isPaused) {
      console.log('⏸️  Pausing for 1 second...\n');
      controlStream.pause();
      isPaused = true;
      
      setTimeout(() => {
        console.log('▶️  Resuming...');
        controlStream.resume();
        isPaused = false;
      }, 1000);
    }
  });
  
  controlStream.on('end', () => {
    console.log('✅ Stream control demo complete!\n');
  });
}, 5500);

// ৮. Stream Close Event
// ---------------------
setTimeout(() => {
  console.log('৮. Stream Lifecycle Events:');
  console.log('─'.repeat(50));
  
  const lifecycleStream = fs.createReadStream(
    path.join(__dirname, 'test-data', 'small-file.txt')
  );
  
  lifecycleStream.on('open', (fd) => {
    console.log('🔓 Stream opened (file descriptor:', fd + ')');
  });
  
  lifecycleStream.on('ready', () => {
    console.log('✅ Stream ready to read');
  });
  
  lifecycleStream.on('data', () => {
    console.log('📦 Data chunk received');
  });
  
  lifecycleStream.on('end', () => {
    console.log('🏁 Stream ended (no more data)');
  });
  
  lifecycleStream.on('close', () => {
    console.log('🔒 Stream closed\n');
  });
}, 7000);

setTimeout(() => {
  console.log('=== Streams Basics Complete! ===');
}, 8500);