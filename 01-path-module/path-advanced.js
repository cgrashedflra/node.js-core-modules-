// Path Module - Advanced Real-life Examples
// ==========================================

const path = require('path');

console.log('=== Real-life Path Usage ===\n');

// Example 1: File Upload System
// ------------------------------
console.log('১. File Upload System:');

function saveUploadedFile(originalName) {
  // User যদি "my document.pdf" upload করে
  const ext = path.extname(originalName); // .pdf
  const nameWithoutExt = path.basename(originalName, ext); // my document
  
  // Safe filename তৈরি (spaces remove)
  const safeName = nameWithoutExt.replace(/\s+/g, '_'); // my_document
  
  // Timestamp add করো
  const timestamp = Date.now();
  const newFileName = `${safeName}_${timestamp}${ext}`;
  
  // Full upload path
  const uploadDir = path.join(__dirname, 'uploads', 'documents');
  const fullPath = path.join(uploadDir, newFileName);
  
  return {
    originalName,
    newFileName,
    fullPath,
    directory: uploadDir
  };
}

const uploadedFile = saveUploadedFile('my document.pdf');
console.log('Upload info:', uploadedFile);
console.log('');

// Example 2: Static File Server Path Handler
// -------------------------------------------
console.log('২. Static File Server:');

function getStaticFilePath(requestUrl) {
  // User request: /images/profile.jpg
  // Server: /var/www/html/public/images/profile.jpg
  
  const publicDir = path.join(__dirname, 'public');
  const filePath = path.join(publicDir, requestUrl);
  
  // Security check: Path traversal attack prevent করো
  // যদি কেউ ../../etc/passwd দেয় তাহলে?
  const normalizedPath = path.normalize(filePath);
  
  if (!normalizedPath.startsWith(publicDir)) {
    return { error: 'Invalid path - Security violation!' };
  }
  
  return {
    requestedUrl: requestUrl,
    serverPath: normalizedPath,
    isAllowed: true
  };
}

console.log('Valid request:', getStaticFilePath('/images/logo.png'));
console.log('Attack attempt:', getStaticFilePath('/../../../etc/passwd'));
console.log('');

// Example 3: Log File Naming System
// ----------------------------------
console.log('৩. Log File System:');

function createLogFileName(logType) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const logFileName = `${logType}_${year}-${month}-${day}.log`;
  const logDir = path.join(__dirname, 'logs', year.toString(), month);
  const logFilePath = path.join(logDir, logFileName);
  
  return {
    fileName: logFileName,
    directory: logDir,
    fullPath: logFilePath
  };
}

console.log('Error log:', createLogFileName('error'));
console.log('Access log:', createLogFileName('access'));
console.log('');

// Example 4: Module Import Path Resolver
// ---------------------------------------
console.log('৪. Module Path Resolver:');

function resolveModulePath(moduleName, fromFile) {
  // fromFile: /home/project/src/controllers/user.js
  // moduleName: ../../utils/helper.js
  
  const currentDir = path.dirname(fromFile);
  const modulePath = path.join(currentDir, moduleName);
  const absolutePath = path.resolve(modulePath);
  
  return {
    from: fromFile,
    import: moduleName,
    resolved: absolutePath
  };
}

const importPath = '/home/project/src/controllers/user.js';
const moduleImport = '../../utils/helper.js';

console.log('Module resolution:', resolveModulePath(moduleImport, importPath));
console.log('');

// Example 5: Build Tool Output Path Generator
// --------------------------------------------
console.log('৫. Build Tool Path Generator:');

function generateBuildPaths(sourceFile, outputDir) {
  // Source: src/components/Header.jsx
  // Output: dist/components/Header.js
  
  const parsed = path.parse(sourceFile);
  const relativePath = path.relative('src', parsed.dir);
  
  const outputFileName = parsed.name + '.js'; // .jsx -> .js
  const outputPath = path.join(outputDir, relativePath, outputFileName);
  
  return {
    source: sourceFile,
    output: outputPath,
    sourceMap: outputPath + '.map'
  };
}

console.log('Build paths:', generateBuildPaths('src/components/Header.jsx', 'dist'));
console.log('');

// Example 6: Config File Finder
// ------------------------------
console.log('৬. Config File Finder (like package.json):');

function findConfigFile(startDir, configFileName) {
  // package.json খুঁজে বের করার মতো
  // Current directory থেকে শুরু করে root পর্যন্ত খুঁজবে
  
  let currentDir = startDir;
  const root = path.parse(currentDir).root;
  const searchPath = [];
  
  while (currentDir !== root) {
    const configPath = path.join(currentDir, configFileName);
    searchPath.push(configPath);
    currentDir = path.dirname(currentDir);
  }
  
  return {
    searchedPaths: searchPath,
    message: 'এই paths গুলোতে খুঁজবে (উপর থেকে নিচে)'
  };
}

console.log(findConfigFile(__dirname, 'package.json'));
console.log('');

// Example 7: Asset URL Generator
// -------------------------------
console.log('৭. Asset URL Generator:');

function generateAssetUrl(filePath, baseUrl = 'https://cdn.example.com') {
  // Local: /var/www/assets/images/logo.png
  // URL: https://cdn.example.com/images/logo.png
  
  const assetsDir = '/var/www/assets';
  const relativePath = path.relative(assetsDir, filePath);
  
  // Path separators কে URL এর জন্য forward slash এ convert করো
  const urlPath = relativePath.split(path.sep).join('/');
  
  const fullUrl = `${baseUrl}/${urlPath}`;
  
  return {
    localPath: filePath,
    url: fullUrl
  };
}

console.log(generateAssetUrl('/var/www/assets/images/products/phone.jpg'));
console.log('');

console.log('=== Advanced Examples Complete! ===');