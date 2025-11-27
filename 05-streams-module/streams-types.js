// Streams Module - All Stream Types
// ==================================

const { Readable, Writable, Duplex, Transform } = require('stream');
const fs = require('fs');
const path = require('path');

console.log('=== Stream Types শিখি ===\n');

// ১. Custom Readable Stream
// --------------------------
console.log('১. Custom Readable Stream:');
console.log('─'.repeat(50));

class NumberStream extends Readable {
  constructor(max) {
    super();
    this.current = 1;
    this.max = max;
  }
  
  _read() {
    if (this.current <= this.max) {
      // Push data to stream
      this.push(`Number: ${this.current}\n`);
      this.current++;
    } else {
      // No more data
      this.push(null);
    }
  }
}

const numberStream = new NumberStream(5);

numberStream.on('data', (chunk) => {
  process.stdout.write(chunk.toString());
});

numberStream.on('end', () => {
  console.log('✅ Number stream complete!\n');
});

// ২. Custom Writable Stream
// --------------------------
setTimeout(() => {
  console.log('২. Custom Writable Stream:');
  console.log('─'.repeat(50));
  
  class LogStream extends Writable {
    constructor() {
      super();
      this.logs = [];
    }
    
    _write(chunk, encoding, callback) {
      const log = chunk.toString();
      this.logs.push(log);
      console.log('📝 Logged:', log.trim());
      callback(); // Signal write complete
    }
    
    _final(callback) {
      console.log(`\n✅ Total logs written: ${this.logs.length}`);
      callback();
    }
  }
  
  const logStream = new LogStream();
  
  logStream.write('Log entry 1\n');
  logStream.write('Log entry 2\n');
  logStream.write('Log entry 3\n');
  logStream.end('Final log entry\n');
  
  console.log('');
}, 500);

// ৩. Duplex Stream (Read + Write)
// --------------------------------
setTimeout(() => {
  console.log('৩. Duplex Stream (Read & Write):');
  console.log('─'.repeat(50));
  
  class EchoStream extends Duplex {
    constructor() {
      super();
      this.data = [];
    }
    
    _read() {
      if (this.data.length > 0) {
        this.push(this.data.shift());
      }
    }
    
    _write(chunk, encoding, callback) {
      const message = chunk.toString().toUpperCase();
      console.log('📥 Received:', chunk.toString().trim());
      console.log('📤 Echoing:', message.trim());
      
      // Store for reading
      this.data.push(message);
      callback();
    }
  }
  
  const echoStream = new EchoStream();
  
  // Write to stream
  echoStream.write('hello\n');
  echoStream.write('world\n');
  echoStream.end();
  
  // Read from stream
  echoStream.on('data', (chunk) => {
    console.log('🔊 Echo output:', chunk.toString().trim());
  });
  
  echoStream.on('finish', () => {
    console.log('✅ Duplex stream complete!\n');
  });
}, 1000);

// ৪. Transform Stream - Data Transformation
// ------------------------------------------
setTimeout(() => {
  console.log('৪. Transform Stream - Uppercase Transformer:');
  console.log('─'.repeat(50));
  
  class UpperCaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
      // Transform data
      const transformed = chunk.toString().toUpperCase();
      this.push(transformed);
      callback();
    }
  }
  
  const upperCase = new UpperCaseTransform();
  
  upperCase.on('data', (chunk) => {
    console.log('Transformed:', chunk.toString().trim());
  });
  
  upperCase.write('hello world\n');
  upperCase.write('node.js streams\n');
  upperCase.end('final text\n');
  
  upperCase.on('finish', () => {
    console.log('✅ Transform complete!\n');
  });
}, 1500);

// ৫. Transform Stream - JSON Parser
// ----------------------------------
setTimeout(() => {
  console.log('৫. Transform Stream - JSON Line Parser:');
  console.log('─'.repeat(50));
  
  class JSONLineParser extends Transform {
    constructor() {
      super({ objectMode: true }); // Enable object mode
    }
    
    _transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');
      
      lines.forEach(line => {
        if (line.trim()) {
          try {
            const obj = JSON.parse(line);
            this.push(obj); // Push object instead of string
          } catch (err) {
            console.error('Invalid JSON:', line);
          }
        }
      });
      
      callback();
    }
  }
  
  const jsonParser = new JSONLineParser();
  
  jsonParser.on('data', (obj) => {
    console.log('Parsed object:', obj);
  });
  
  // Send JSON lines
  jsonParser.write('{"name":"John","age":30}\n');
  jsonParser.write('{"name":"Jane","age":25}\n');
  jsonParser.end('{"name":"Bob","age":35}\n');
  
  jsonParser.on('finish', () => {
    console.log('✅ JSON parsing complete!\n');
  });
}, 2000);

// ৬. Transform Stream - CSV to JSON
// ----------------------------------
setTimeout(() => {
  console.log('৬. Transform Stream - CSV to JSON:');
  console.log('─'.repeat(50));
  
  class CSVToJSON extends Transform {
    constructor() {
      super({ objectMode: true });
      this.headers = null;
      this.isFirstLine = true;
    }
    
    _transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');
      
      lines.forEach(line => {
        if (!line.trim()) return;
        
        if (this.isFirstLine) {
          this.headers = line.split(',').map(h => h.trim());
          this.isFirstLine = false;
        } else {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          
          this.headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          
          this.push(obj);
        }
      });
      
      callback();
    }
  }
  
  const csvParser = new CSVToJSON();
  
  csvParser.on('data', (obj) => {
    console.log('CSV row as JSON:', obj);
  });
  
  // Send CSV data
  csvParser.write('name,age,city\n');
  csvParser.write('John,30,Dhaka\n');
  csvParser.write('Jane,25,Chittagong\n');
  csvParser.end('Bob,35,Sylhet\n');
  
  csvParser.on('finish', () => {
    console.log('✅ CSV to JSON complete!\n');
  });
}, 2500);

// ৭. Piping Multiple Transforms
// ------------------------------
setTimeout(() => {
  console.log('৭. Chaining Multiple Transforms:');
  console.log('─'.repeat(50));
  
  // Transform 1: Add line numbers
  class AddLineNumbers extends Transform {
    constructor() {
      super();
      this.lineNumber = 1;
    }
    
    _transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');
      const numbered = lines
        .filter(line => line.trim())
        .map(line => `${this.lineNumber++}. ${line}`)
        .join('\n') + '\n';
      
      this.push(numbered);
      callback();
    }
  }
  
  // Transform 2: Convert to uppercase
  class ToUpperCase extends Transform {
    _transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  }
  
  // Transform 3: Add prefix
  class AddPrefix extends Transform {
    _transform(chunk, encoding, callback) {
      const prefixed = chunk.toString()
        .split('\n')
        .filter(line => line.trim())
        .map(line => `>> ${line}`)
        .join('\n') + '\n';
      
      this.push(prefixed);
      callback();
    }
  }
  
  const addNumbers = new AddLineNumbers();
  const toUpper = new ToUpperCase();
  const addPrefix = new AddPrefix();
  
  // Chain transforms
  const input = new Readable();
  input.push('hello\n');
  input.push('world\n');
  input.push('node.js\n');
  input.push(null);
  
  console.log('Original → Add Numbers → Uppercase → Add Prefix\n');
  
  input
    .pipe(addNumbers)
    .pipe(toUpper)
    .pipe(addPrefix)
    .on('data', (chunk) => {
      process.stdout.write(chunk.toString());
    })
    .on('end', () => {
      console.log('\n✅ Transform chain complete!\n');
    });
}, 3000);

// ৮. Object Mode Stream
// ---------------------
setTimeout(() => {
  console.log('৮. Object Mode Stream:');
  console.log('─'.repeat(50));
  
  class ObjectStream extends Transform {
    constructor() {
      super({ objectMode: true });
    }
    
    _transform(obj, encoding, callback) {
      // Process object
      obj.processed = true;
      obj.timestamp = new Date().toISOString();
      this.push(obj);
      callback();
    }
  }
  
  const objectStream = new ObjectStream();
  
  objectStream.on('data', (obj) => {
    console.log('Processed object:', obj);
  });
  
  // Send objects
  objectStream.write({ id: 1, name: 'Item 1' });
  objectStream.write({ id: 2, name: 'Item 2' });
  objectStream.end({ id: 3, name: 'Item 3' });
  
  objectStream.on('finish', () => {
    console.log('✅ Object stream complete!\n');
  });
}, 3500);

// ৯. Real File Transform - Uppercase File
// ----------------------------------------
setTimeout(() => {
  console.log('৯. Real File Transform - Uppercase File:');
  console.log('─'.repeat(50));
  
  class FileUpperCase extends Transform {
    _transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  }
  
  const inputFile = path.join(__dirname, 'test-data', 'small-file.txt');
  const outputFile = path.join(__dirname, 'output', 'uppercase.txt');
  
  fs.createReadStream(inputFile)
    .pipe(new FileUpperCase())
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', () => {
      console.log('✅ File transformed to uppercase!');
      console.log('Check:', outputFile);
      console.log('');
    });
}, 4000);

setTimeout(() => {
  console.log('=== All Stream Types Complete! ===');
}, 5000);