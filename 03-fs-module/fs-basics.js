// FS Module - Basic Examples
// ==========================

const fs = require('fs');
const path = require('path');

console.log('=== FS Module শিখি ===\n');

// ১. File পড়া (Asynchronous - Callback Style)
// ---------------------------------------------
console.log('১. File পড়া (Async - Callback):');

const filePath = path.join(__dirname, 'test-data', 'sample.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File content (async):');
  console.log(data);
  console.log('');
});

// ২. File পড়া (Synchronous - Blocking)
// --------------------------------------
console.log('২. File পড়া (Sync - Blocking):');

try {
  const dataSync = fs.readFileSync(filePath, 'utf8');
  console.log('File content (sync):');
  console.log(dataSync);
  console.log('');
} catch (err) {
  console.error('Error:', err.message);
}

// ৩. File লিখা (Write - Overwrite করবে)
// --------------------------------------
console.log('৩. File লিখা (writeFile):');

const newFilePath = path.join(__dirname, 'output.txt');
const content = 'এটি নতুন file!\nNode.js দিয়ে তৈরি করা হয়েছে।';

fs.writeFile(newFilePath, content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err.message);
    return;
  }
  console.log('✓ File successfully written to:', newFilePath);
  console.log('');
});

// ৪. File এ Add করা (Append)
// ---------------------------
setTimeout(() => {
  console.log('৪. File এ content add (appendFile):');
  
  const appendContent = '\nএটি append করা line!';
  
  fs.appendFile(newFilePath, appendContent, 'utf8', (err) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    console.log('✓ Content appended successfully!');
    console.log('');
  });
}, 100);

// ৫. File এর Information (Stats)
// -------------------------------
setTimeout(() => {
  console.log('৫. File Information (stat):');
  
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    
    console.log('File Stats:');
    console.log('  Size:', stats.size, 'bytes');
    console.log('  Created:', stats.birthtime);
    console.log('  Modified:', stats.mtime);
    console.log('  Is File?', stats.isFile());
    console.log('  Is Directory?', stats.isDirectory());
    console.log('');
  });
}, 200);

// ৬. File Exists Check করা
// --------------------------
setTimeout(() => {
  console.log('৬. File exists check (fs.access):');
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('File does not exist');
    } else {
      console.log('✓ File exists!');
    }
    console.log('');
  });
}, 300);

// ৭. File Copy করা
// -----------------
setTimeout(() => {
  console.log('৭. File Copy (copyFile):');
  
  const copyPath = path.join(__dirname, 'copy-of-sample.txt');
  
  fs.copyFile(filePath, copyPath, (err) => {
    if (err) {
      console.error('Error copying:', err.message);
      return;
    }
    console.log('✓ File copied to:', copyPath);
    console.log('');
  });
}, 400);

// ৮. File Rename করা
// -------------------
setTimeout(() => {
  console.log('৮. File Rename (rename):');
  
  const oldPath = path.join(__dirname, 'copy-of-sample.txt');
  const newPath = path.join(__dirname, 'renamed-sample.txt');
  
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error('Error renaming:', err.message);
      return;
    }
    console.log('✓ File renamed successfully!');
    console.log('  From:', oldPath);
    console.log('  To:', newPath);
    console.log('');
  });
}, 500);

// ৯. Directory তৈরি করা
// ----------------------
setTimeout(() => {
  console.log('৯. Directory তৈরি (mkdir):');
  
  const newDir = path.join(__dirname, 'new-folder');
  
  fs.mkdir(newDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err.message);
      return;
    }
    console.log('✓ Directory created:', newDir);
    console.log('');
  });
}, 600);

// ১০. Directory এর Contents পড়া
// --------------------------------
setTimeout(() => {
  console.log('১০. Directory contents (readdir):');
  
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err.message);
      return;
    }
    
    console.log('Files in current directory:');
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    console.log('');
  });
}, 700);

// ১১. File Delete করা
// --------------------
setTimeout(() => {
  console.log('১১. File Delete (unlink):');
  
  const fileToDelete = path.join(__dirname, 'renamed-sample.txt');
  
  fs.unlink(fileToDelete, (err) => {
    if (err) {
      console.error('Error deleting file:', err.message);
      return;
    }
    console.log('✓ File deleted:', fileToDelete);
    console.log('');
  });
}, 800);

// ১২. Directory Delete করা
// --------------------------
setTimeout(() => {
  console.log('১২. Directory Delete (rmdir):');
  
  const dirToDelete = path.join(__dirname, 'new-folder');
  
  fs.rmdir(dirToDelete, (err) => {
    if (err) {
      console.error('Error deleting directory:', err.message);
      return;
    }
    console.log('✓ Directory deleted:', dirToDelete);
    console.log('');
  });
}, 900);

// ১৩. Watch File Changes
// -----------------------
setTimeout(() => {
  console.log('১৩. Watch file for changes (watch):');
  
  const watchPath = path.join(__dirname, 'output.txt');
  
  console.log('Watching file:', watchPath);
  console.log('(File এ কিছু change করলে notification দেখবে)\n');
  
  const watcher = fs.watch(watchPath, (eventType, filename) => {
    console.log(`File changed! Event: ${eventType}, File: ${filename}`);
  });
  
  // 3 second পরে watcher stop করো
  setTimeout(() => {
    watcher.close();
    console.log('Watcher stopped.\n');
  }, 3000);
  
}, 1000);

// ১৪. JSON File Read/Write
// -------------------------
setTimeout(() => {
  console.log('১৪. JSON File Operations:');
  
  const jsonPath = path.join(__dirname, 'data.json');
  
  const jsonData = {
    name: 'John Doe',
    age: 25,
    skills: ['JavaScript', 'Node.js', 'React'],
    address: {
      city: 'Dhaka',
      country: 'Bangladesh'
    }
  };
  
  // JSON write করা
  fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON:', err.message);
      return;
    }
    console.log('✓ JSON file written!');
    
    // JSON read করা
    fs.readFile(jsonPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON:', err.message);
        return;
      }
      
      const parsedData = JSON.parse(data);
      console.log('✓ JSON file read:');
      console.log(parsedData);
      console.log('');
    });
  });
}, 4000);

setTimeout(() => {
  console.log('=== FS Module Basics Complete! ===');
}, 5000);