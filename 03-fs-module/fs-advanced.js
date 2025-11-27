// FS Module - Advanced Real-life Examples
// =========================================

const fs = require('fs').promises; // Promise-based FS
const fsSync = require('fs'); // Sync methods যদি লাগে
const path = require('path');

console.log('=== FS Module Advanced Examples ===\n');

// Example 1: File Upload Handler
// -------------------------------
async function handleFileUpload(filename, content) {
  try {
    // Upload directory check করো, না থাকলে তৈরি করো
    const uploadDir = path.join(__dirname, 'uploads');
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log('✓ Upload directory created');
    }
    
    // File এর extension check
    const ext = path.extname(filename);
    const allowedExts = ['.jpg', '.png', '.pdf', '.txt'];
    
    if (!allowedExts.includes(ext.toLowerCase())) {
      throw new Error('File type not allowed');
    }
    
    // Unique filename তৈরি করো
    const timestamp = Date.now();
    const safeName = path.basename(filename, ext).replace(/\s+/g, '_');
    const newFilename = `${safeName}_${timestamp}${ext}`;
    const filePath = path.join(uploadDir, newFilename);
    
    // File save করো
    await fs.writeFile(filePath, content);
    
    // File info return করো
    const stats = await fs.stat(filePath);
    
    return {
      success: true,
      originalName: filename,
      savedName: newFilename,
      path: filePath,
      size: stats.size,
      uploadedAt: new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

// Example 1 Test
(async () => {
  console.log('১. File Upload Handler:');
  console.log('─'.repeat(50));
  
  const result = await handleFileUpload('my photo.jpg', 'fake image content');
  console.log(result);
  console.log('');
})();

// Example 2: Log File Manager
// ----------------------------
class LogManager {
  constructor(logDir) {
    this.logDir = logDir;
  }
  
  async initialize() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (err) {
      console.error('Error creating log directory:', err.message);
    }
  }
  
  getLogFilePath(level) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `${level}_${dateStr}.log`;
    return path.join(this.logDir, filename);
  }
  
  async log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    const logPath = this.getLogFilePath(level);
    
    try {
      await fs.appendFile(logPath, logEntry, 'utf8');
    } catch (err) {
      console.error('Logging error:', err.message);
    }
  }
  
  async info(message) {
    await this.log('info', message);
  }
  
  async error(message) {
    await this.log('error', message);
  }
  
  async warning(message) {
    await this.log('warning', message);
  }
  
  async getLogs(level, date) {
    const logPath = path.join(this.logDir, `${level}_${date}.log`);
    
    try {
      const content = await fs.readFile(logPath, 'utf8');
      return content.split('\n').filter(line => line.length > 0);
    } catch (err) {
      return [];
    }
  }
}

// Example 2 Test
setTimeout(async () => {
  console.log('২. Log Manager:');
  console.log('─'.repeat(50));
  
  const logger = new LogManager(path.join(__dirname, 'logs'));
  await logger.initialize();
  
  await logger.info('Application started');
  await logger.error('Database connection failed');
  await logger.warning('High memory usage detected');
  
  console.log('✓ Logs written successfully!');
  console.log('Check the logs folder for log files\n');
}, 100);

// Example 3: Config File Manager
// -------------------------------
class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = {};
  }
  
  async load() {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(data);
      return this.config;
    } catch (err) {
      // Config file না থাকলে default config তৈরি করো
      this.config = this.getDefaultConfig();
      await this.save();
      return this.config;
    }
  }
  
  getDefaultConfig() {
    return {
      app: {
        name: 'My App',
        version: '1.0.0',
        port: 3000
      },
      database: {
        host: 'localhost',
        port: 5432,
        name: 'mydb'
      },
      features: {
        enableLogging: true,
        enableCache: false
      }
    };
  }
  
  async save() {
    try {
      const data = JSON.stringify(this.config, null, 2);
      await fs.writeFile(this.configPath, data, 'utf8');
      return true;
    } catch (err) {
      console.error('Error saving config:', err.message);
      return false;
    }
  }
  
  get(key) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return null;
    }
    
    return value;
  }
  
  set(key, value) {
    const keys = key.split('.');
    let obj = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
  }
}

// Example 3 Test
setTimeout(async () => {
  console.log('৩. Config Manager:');
  console.log('─'.repeat(50));
  
  const configPath = path.join(__dirname, 'config.json');
  const config = new ConfigManager(configPath);
  
  await config.load();
  console.log('✓ Config loaded');
  
  console.log('App Name:', config.get('app.name'));
  console.log('Port:', config.get('app.port'));
  
  config.set('app.port', 4000);
  await config.save();
  console.log('✓ Config updated and saved\n');
}, 200);

// Example 4: Directory Scanner (Recursive)
// -----------------------------------------
async function scanDirectory(dirPath, level = 0) {
  const indent = '  '.repeat(level);
  const results = [];
  
  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        results.push({
          type: 'directory',
          name: item,
          path: itemPath,
          indent: indent
        });
        
        // Recursive scan
        const subItems = await scanDirectory(itemPath, level + 1);
        results.push(...subItems);
      } else {
        results.push({
          type: 'file',
          name: item,
          path: itemPath,
          size: stats.size,
          indent: indent
        });
      }
    }
  } catch (err) {
    console.error('Error scanning:', err.message);
  }
  
  return results;
}

// Example 4 Test
setTimeout(async () => {
  console.log('৪. Directory Scanner (Recursive):');
  console.log('─'.repeat(50));
  
  const scanPath = path.join(__dirname, 'test-data');
  const items = await scanDirectory(scanPath);
  
  items.forEach(item => {
    const icon = item.type === 'directory' ? '📁' : '📄';
    const sizeInfo = item.size ? ` (${item.size} bytes)` : '';
    console.log(`${item.indent}${icon} ${item.name}${sizeInfo}`);
  });
  console.log('');
}, 300);

// Example 5: File Backup System
// ------------------------------
async function backupFile(filePath) {
  try {
    const backupDir = path.join(path.dirname(filePath), 'backups');
    
    // Backup directory তৈরি
    await fs.mkdir(backupDir, { recursive: true });
    
    // Backup filename
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${basename}_backup_${timestamp}${ext}`;
    const backupPath = path.join(backupDir, backupName);
    
    // File copy করো
    await fs.copyFile(filePath, backupPath);
    
    const stats = await fs.stat(backupPath);
    
    return {
      success: true,
      original: filePath,
      backup: backupPath,
      size: stats.size,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

// Example 5 Test
setTimeout(async () => {
  console.log('৫. File Backup System:');
  console.log('─'.repeat(50));
  
  const fileToBackup = path.join(__dirname, 'test-data', 'sample.txt');
  const result = await backupFile(fileToBackup);
  
  if (result.success) {
    console.log('✓ Backup created successfully!');
    console.log('  Original:', result.original);
    console.log('  Backup:', result.backup);
    console.log('  Size:', result.size, 'bytes');
  } else {
    console.log('✗ Backup failed:', result.error);
  }
  console.log('');
}, 400);

// Example 6: File Search by Extension
// ------------------------------------
async function findFilesByExtension(dirPath, extension) {
  const results = [];
  
  async function search(currentPath) {
    try {
      const items = await fs.readdir(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = await fs.stat(itemPath);
        
        if (stats.isDirectory()) {
          await search(itemPath);
        } else if (path.extname(item) === extension) {
          results.push({
            name: item,
            path: itemPath,
            size: stats.size,
            modified: stats.mtime
          });
        }
      }
    } catch (err) {
      // Ignore permission errors
    }
  }
  
  await search(dirPath);
  return results;
}

// Example 6 Test
setTimeout(async () => {
  console.log('৬. File Search by Extension:');
  console.log('─'.repeat(50));
  
  const searchPath = __dirname;
  const txtFiles = await findFilesByExtension(searchPath, '.txt');
  
  console.log(`Found ${txtFiles.length} .txt files:`);
  txtFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.name} (${file.size} bytes)`);
  });
  console.log('');
}, 500);

// Example 7: Atomic File Write (Safe Write)
// ------------------------------------------
async function atomicWrite(filePath, content) {
  const tempPath = filePath + '.tmp';
  
  try {
    // Temporary file এ লিখো
    await fs.writeFile(tempPath, content, 'utf8');
    
    // Rename করে original file replace করো (atomic operation)
    await fs.rename(tempPath, filePath);
    
    return { success: true };
  } catch (err) {
    // Error হলে temp file delete করো
    try {
      await fs.unlink(tempPath);
    } catch {}
    
    return { success: false, error: err.message };
  }
}

// Example 7 Test
setTimeout(async () => {
  console.log('৭. Atomic File Write (Safe Write):');
  console.log('─'.repeat(50));
  
  const safePath = path.join(__dirname, 'safe-write.txt');
  const result = await atomicWrite(safePath, 'This is safely written!');
  
  if (result.success) {
    console.log('✓ File written atomically (crash-safe)');
  } else {
    console.log('✗ Write failed:', result.error);
  }
  console.log('');
  
  console.log('=== FS Advanced Examples Complete! ===');
}, 600);