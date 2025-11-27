// OS Module - Basic Examples
// ==========================

// Step 1: OS module import করো
const os = require('os');

console.log('=== OS Module শিখি ===\n');

// ১. Platform Information - কোন OS চলছে?
// ----------------------------------------
console.log('১. Platform & Architecture Info:');

const platform = os.platform();
console.log('Platform:', platform);
// Output: win32 (Windows), linux (Linux), darwin (MacOS)

const architecture = os.arch();
console.log('Architecture:', architecture);
// Output: x64, arm, arm64

const osType = os.type();
console.log('OS Type:', osType);
// Output: Windows_NT, Linux, Darwin

const osRelease = os.release();
console.log('OS Release:', osRelease);
console.log('');

// ২. CPU Information - প্রসেসর এর তথ্য
// -------------------------------------
console.log('২. CPU Information:');

const cpus = os.cpus();
console.log('Number of CPU cores:', cpus.length);
console.log('CPU Model:', cpus[0].model);
console.log('CPU Speed:', cpus[0].speed, 'MHz');

// প্রথম CPU core এর details
console.log('\nFirst CPU Core Details:');
console.log('Model:', cpus[0].model);
console.log('Speed:', cpus[0].speed);
console.log('Times:', cpus[0].times);
console.log('');

// ৩. Memory Information - RAM এর তথ্য
// ------------------------------------
console.log('৩. Memory Information:');

const totalMemory = os.totalmem();
const freeMemory = os.freemem();
const usedMemory = totalMemory - freeMemory;

// Bytes কে GB তে convert করো
const totalMemoryGB = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
const freeMemoryGB = (freeMemory / 1024 / 1024 / 1024).toFixed(2);
const usedMemoryGB = (usedMemory / 1024 / 1024 / 1024).toFixed(2);

console.log('Total Memory:', totalMemoryGB, 'GB');
console.log('Free Memory:', freeMemoryGB, 'GB');
console.log('Used Memory:', usedMemoryGB, 'GB');

// Memory usage percentage
const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);
console.log('Memory Usage:', memoryUsagePercent, '%');
console.log('');

// ৪. Hostname - Computer এর নাম
// ------------------------------
console.log('৪. Hostname:');

const hostname = os.hostname();
console.log('Computer Name:', hostname);
console.log('');

// ৫. User Information - User এর details
// --------------------------------------
console.log('৫. User Information:');

const userInfo = os.userInfo();
console.log('Username:', userInfo.username);
console.log('Home Directory:', userInfo.homedir);
console.log('Shell:', userInfo.shell);
console.log('User ID (UID):', userInfo.uid);
console.log('Group ID (GID):', userInfo.gid);
console.log('');

// ৬. Directory Paths - Important paths
// -------------------------------------
console.log('৬. Important Directories:');

const homeDir = os.homedir();
console.log('Home Directory:', homeDir);

const tempDir = os.tmpdir();
console.log('Temp Directory:', tempDir);
console.log('');

// ৭. System Uptime - কতক্ষণ চলছে?
// --------------------------------
console.log('৭. System Uptime:');

const uptimeSeconds = os.uptime();
const uptimeMinutes = Math.floor(uptimeSeconds / 60);
const uptimeHours = Math.floor(uptimeMinutes / 60);
const uptimeDays = Math.floor(uptimeHours / 24);

console.log('Uptime (seconds):', uptimeSeconds);
console.log('Uptime (readable):', `${uptimeDays} days, ${uptimeHours % 24} hours, ${uptimeMinutes % 60} minutes`);
console.log('');

// ৮. EOL - End of Line character
// -------------------------------
console.log('৮. End of Line Character:');

const eol = os.EOL;
console.log('EOL:', JSON.stringify(eol));
// Windows: \r\n
// Linux/Mac: \n
console.log('EOL length:', eol.length);
console.log('');

// ৯. Load Average - System load (Linux/Mac only)
// -----------------------------------------------
console.log('৯. Load Average (Linux/Mac only):');

try {
  const loadAvg = os.loadavg();
  console.log('Load Average (1, 5, 15 min):', loadAvg);
} catch (error) {
  console.log('Load average not available on Windows');
}
console.log('');

// ১০. Network Interfaces - Network card info
// -------------------------------------------
console.log('১০. Network Interfaces:');

const networkInterfaces = os.networkInterfaces();
console.log('Available Network Interfaces:', Object.keys(networkInterfaces));

// First network interface এর details
const firstInterface = Object.keys(networkInterfaces)[0];
console.log(`\n${firstInterface} Details:`);
networkInterfaces[firstInterface].forEach((net, index) => {
  console.log(`  [${index}] Family: ${net.family}, Address: ${net.address}`);
});
console.log('');

// ১১. Constants - OS specific constants
// --------------------------------------
console.log('১১. OS Constants:');

console.log('Signal Constants Available:', Object.keys(os.constants.signals).length);
console.log('Example Signals:', Object.keys(os.constants.signals).slice(0, 5));

console.log('Error Constants Available:', Object.keys(os.constants.errno).length);
console.log('');

// ১২. Priority Constants - Process priority
// ------------------------------------------
console.log('১২. Process Priority Constants:');

if (os.constants.priority) {
  console.log('Priority Levels:');
  console.log('  LOW:', os.constants.priority.PRIORITY_LOW);
  console.log('  NORMAL:', os.constants.priority.PRIORITY_NORMAL);
  console.log('  HIGH:', os.constants.priority.PRIORITY_HIGH);
  console.log('  HIGHEST:', os.constants.priority.PRIORITY_HIGHEST);
}
console.log('');

console.log('=== OS Module Basic Complete! ===');