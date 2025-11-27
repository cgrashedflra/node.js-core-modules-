// FS Module - Async vs Sync Comparison
// =====================================

const fs = require('fs');
const path = require('path');

console.log('=== Async vs Sync Comparison ===\n');

// Test file path
const filePath = path.join(__dirname, 'test-data', 'sample.txt');

// ===================================
// Example 1: Synchronous (Blocking)
// ===================================
console.log('১. Synchronous (Blocking) Example:');
console.log('─'.repeat(50));

console.log('Starting sync operation...');

try {
  const data = fs.readFileSync(filePath, 'utf8');
  console.log('File read successfully (sync)');
  console.log('Content length:', data.length, 'characters');
} catch (err) {
  console.error('Error:', err.message);
}

console.log('Sync operation complete!');
console.log('এই line আগের operation শেষ হওয়ার পরে execute হবে\n');

// ===================================
// Example 2: Asynchronous (Non-blocking)
// ===================================
console.log('২. Asynchronous (Non-blocking) Example:');
console.log('─'.repeat(50));

console.log('Starting async operation...');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('File read successfully (async)');
  console.log('Content length:', data.length, 'characters');
});

console.log('এই line async operation শুরু হওয়ার সাথে সাথেই execute হবে!');
console.log('File read এখনো complete হয়নি, কিন্তু program আটকে নেই!\n');

// ===================================
// Example 3: Promise-based Async
// ===================================
setTimeout(() => {
  console.log('৩. Promise-based Async (Modern Way):');
  console.log('─'.repeat(50));
  
  const fsPromises = fs.promises;
  
  console.log('Starting promise-based operation...');
  
  fsPromises.readFile(filePath, 'utf8')
    .then(data => {
      console.log('File read successfully (promise)');
      console.log('Content length:', data.length, 'characters');
    })
    .catch(err => {
      console.error('Error:', err.message);
    });
  
  console.log('এটিও non-blocking!\n');
}, 100);

// ===================================
// Example 4: Async/Await (Best Practice)
// ===================================
setTimeout(async () => {
  console.log('৪. Async/Await (Recommended):');
  console.log('─'.repeat(50));
  
  const fsPromises = fs.promises;
  
  try {
    console.log('Starting async/await operation...');
    
    const data = await fsPromises.readFile(filePath, 'utf8');
    console.log('File read successfully (async/await)');
    console.log('Content length:', data.length, 'characters');
    console.log('Clean code, easy to read!\n');
  } catch (err) {
    console.error('Error:', err.message);
  }
}, 200);

// ===================================
// Example 5: Performance Comparison
// ===================================
setTimeout(() => {
  console.log('৫. Performance Comparison:');
  console.log('─'.repeat(50));
  
  // Sync version
  console.log('\nSync Version:');
  const syncStart = Date.now();
  
  for (let i = 0; i < 5; i++) {
    try {
      fs.readFileSync(filePath, 'utf8');
      console.log(`  Read ${i + 1} complete`);
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
  
  const syncTime = Date.now() - syncStart;
  console.log(`Sync took: ${syncTime}ms (Blocks other operations!)\n`);
  
  // Async version
  console.log('Async Version:');
  const asyncStart = Date.now();
  let completed = 0;
  
  for (let i = 0; i < 5; i++) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error:', err.message);
        return;
      }
      completed++;
      console.log(`  Read ${completed} complete`);
      
      if (completed === 5) {
        const asyncTime = Date.now() - asyncStart;
        console.log(`Async took: ${asyncTime}ms (Non-blocking!)\n`);
      }
    });
  }
  
  console.log('Async operations started, program continues...\n');
}, 300);

// ===================================
// Example 6: Multiple File Operations
// ===================================
setTimeout(() => {
  console.log('৬. Multiple File Operations (Sequential vs Parallel):');
  console.log('─'.repeat(50));
  
  const file1 = path.join(__dirname, 'test-data', 'sample.txt');
  const file2 = path.join(__dirname, 'output.txt');
  
  // Sequential (Sync) - একটার পর একটা
  console.log('\nSequential (Sync):');
  const seqStart = Date.now();
  
  try {
    const data1 = fs.readFileSync(file1, 'utf8');
    console.log('  File 1 read');
    const data2 = fs.readFileSync(file2, 'utf8');
    console.log('  File 2 read');
    
    const seqTime = Date.now() - seqStart;
    console.log(`Sequential took: ${seqTime}ms\n`);
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  // Parallel (Async) - একসাথে
  console.log('Parallel (Async):');
  const parStart = Date.now();
  let parCompleted = 0;
  
  fs.readFile(file1, 'utf8', (err, data) => {
    if (err) console.error('Error file1:', err.message);
    else console.log('  File 1 read');
    
    parCompleted++;
    if (parCompleted === 2) {
      const parTime = Date.now() - parStart;
      console.log(`Parallel took: ${parTime}ms (Faster!)\n`);
    }
  });
  
  fs.readFile(file2, 'utf8', (err, data) => {
    if (err) console.error('Error file2:', err.message);
    else console.log('  File 2 read');
    
    parCompleted++;
    if (parCompleted === 2) {
      const parTime = Date.now() - parStart;
      console.log(`Parallel took: ${parTime}ms (Faster!)\n`);
    }
  });
}, 800);

// ===================================
// Example 7: When to use Sync?
// ===================================
setTimeout(() => {
  console.log('৭. When to use Sync methods?');
  console.log('─'.repeat(50));
  console.log(`
  Sync ব্যবহার করো যখন:
  ✓ Application startup এ config file পড়তে হবে
  ✓ CLI tools যেখানে blocking acceptable
  ✓ Simple scripts যেখানে performance critical না
  
  Async ব্যবহার করো যখন:
  ✓ Server applications (Express, HTTP servers)
  ✓ Large files নিয়ে কাজ করতে হবে
  ✓ Multiple file operations একসাথে
  ✓ Performance matters
  `);
  
  console.log('=== Async vs Sync Complete! ===');
}, 1500);