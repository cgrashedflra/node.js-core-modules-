// OS Module - Real-life System Info Dashboard
// ============================================

const os = require('os');

console.log('╔════════════════════════════════════════════╗');
console.log('║     SYSTEM INFORMATION DASHBOARD           ║');
console.log('╚════════════════════════════════════════════╝\n');

// Example 1: System Health Monitor
// ---------------------------------
function getSystemHealth() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;
  
  const cpus = os.cpus();
  const avgSpeed = cpus.reduce((sum, cpu) => sum + cpu.speed, 0) / cpus.length;
  
  // Health status determine করো
  let healthStatus = 'GOOD';
  let healthColor = '🟢';
  
  if (memUsagePercent > 90) {
    healthStatus = 'CRITICAL';
    healthColor = '🔴';
  } else if (memUsagePercent > 75) {
    healthStatus = 'WARNING';
    healthColor = '🟡';
  }
  
  return {
    status: healthStatus,
    indicator: healthColor,
    memory: {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      usagePercent: memUsagePercent.toFixed(2) + '%'
    },
    cpu: {
      cores: cpus.length,
      model: cpus[0].model,
      avgSpeed: avgSpeed.toFixed(0) + ' MHz'
    },
    uptime: formatUptime(os.uptime())
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
}

console.log('১. SYSTEM HEALTH MONITOR');
console.log('─'.repeat(50));
const health = getSystemHealth();
console.log(`Status: ${health.indicator} ${health.status}`);
console.log(`Uptime: ${health.uptime}`);
console.log('\nMemory:');
console.log(`  Total: ${health.memory.total}`);
console.log(`  Used:  ${health.memory.used} (${health.memory.usagePercent})`);
console.log(`  Free:  ${health.memory.free}`);
console.log('\nCPU:');
console.log(`  Cores: ${health.cpu.cores}`);
console.log(`  Model: ${health.cpu.model}`);
console.log(`  Speed: ${health.cpu.avgSpeed}`);
console.log('');

// Example 2: Cross-Platform Path Generator
// -----------------------------------------
function getPlatformPaths() {
  const platform = os.platform();
  
  const paths = {
    platform: platform,
    home: os.homedir(),
    temp: os.tmpdir(),
    config: '',
    logs: ''
  };
  
  // Platform based paths
  if (platform === 'win32') {
    paths.config = `${os.homedir()}\\AppData\\Roaming\\MyApp`;
    paths.logs = `${os.homedir()}\\AppData\\Local\\MyApp\\logs`;
  } else if (platform === 'darwin') {
    paths.config = `${os.homedir()}/Library/Application Support/MyApp`;
    paths.logs = `${os.homedir()}/Library/Logs/MyApp`;
  } else {
    paths.config = `${os.homedir()}/.config/myapp`;
    paths.logs = `${os.homedir()}/.local/share/myapp/logs`;
  }
  
  return paths;
}

console.log('২. CROSS-PLATFORM PATHS');
console.log('─'.repeat(50));
const paths = getPlatformPaths();
console.log('Platform:', paths.platform);
console.log('Home Directory:', paths.home);
console.log('Temp Directory:', paths.temp);
console.log('Config Directory:', paths.config);
console.log('Logs Directory:', paths.logs);
console.log('');

// Example 3: Network Interface Scanner
// -------------------------------------
function scanNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const result = [];
  
  for (const [name, nets] of Object.entries(interfaces)) {
    for (const net of nets) {
      // Skip internal/loopback addresses
      if (!net.internal) {
        result.push({
          interface: name,
          family: net.family,
          address: net.address,
          mac: net.mac,
          netmask: net.netmask
        });
      }
    }
  }
  
  return result;
}

console.log('৩. NETWORK INTERFACES');
console.log('─'.repeat(50));
const networks = scanNetworkInterfaces();
networks.forEach((net, index) => {
  console.log(`[${index + 1}] ${net.interface}`);
  console.log(`    IP (${net.family}): ${net.address}`);
  console.log(`    MAC: ${net.mac}`);
  console.log(`    Netmask: ${net.netmask}`);
});
console.log('');

// Example 4: CPU Usage Monitor (Simple)
// --------------------------------------
function getCPUUsage() {
  const cpus = os.cpus();
  const cpuUsage = [];
  
  cpus.forEach((cpu, index) => {
    const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
    const idle = cpu.times.idle;
    const usage = ((total - idle) / total) * 100;
    
    cpuUsage.push({
      core: index,
      model: cpu.model,
      speed: cpu.speed,
      usage: usage.toFixed(2) + '%'
    });
  });
  
  return cpuUsage;
}

console.log('৪. CPU USAGE (Instant snapshot)');
console.log('─'.repeat(50));
const cpuUsage = getCPUUsage();
cpuUsage.forEach(cpu => {
  console.log(`Core ${cpu.core}: ${cpu.usage} @ ${cpu.speed} MHz`);
});
console.log('');

// Example 5: System Requirements Checker
// ---------------------------------------
function checkSystemRequirements(requirements) {
  const totalMemGB = os.totalmem() / 1024 / 1024 / 1024;
  const cpuCores = os.cpus().length;
  const platform = os.platform();
  
  const checks = {
    memory: totalMemGB >= requirements.minMemoryGB,
    cpu: cpuCores >= requirements.minCores,
    platform: requirements.supportedPlatforms.includes(platform),
    allPassed: false
  };
  
  checks.allPassed = checks.memory && checks.cpu && checks.platform;
  
  return {
    system: {
      memory: totalMemGB.toFixed(2) + ' GB',
      cpu: cpuCores + ' cores',
      platform: platform
    },
    requirements: requirements,
    checks: checks,
    canRun: checks.allPassed
  };
}

// Example app requirements
const myAppRequirements = {
  minMemoryGB: 4,
  minCores: 2,
  supportedPlatforms: ['win32', 'linux', 'darwin']
};

console.log('৫. SYSTEM REQUIREMENTS CHECKER');
console.log('─'.repeat(50));
const reqCheck = checkSystemRequirements(myAppRequirements);
console.log('Your System:');
console.log(`  Memory: ${reqCheck.system.memory}`);
console.log(`  CPU: ${reqCheck.system.cpu}`);
console.log(`  Platform: ${reqCheck.system.platform}`);
console.log('\nRequirements:');
console.log(`  Min Memory: ${reqCheck.requirements.minMemoryGB} GB`);
console.log(`  Min Cores: ${reqCheck.requirements.minCores}`);
console.log(`  Platforms: ${reqCheck.requirements.supportedPlatforms.join(', ')}`);
console.log('\nResult:');
console.log(`  Memory: ${reqCheck.checks.memory ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  CPU: ${reqCheck.checks.cpu ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Platform: ${reqCheck.checks.platform ? '✓ PASS' : '✗ FAIL'}`);
console.log(`\n${reqCheck.canRun ? '🟢 App can run!' : '🔴 System does not meet requirements'}`);
console.log('');

// Example 6: Environment Info for Bug Reports
// --------------------------------------------
function generateBugReportInfo() {
  const info = {
    timestamp: new Date().toISOString(),
    os: {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname()
    },
    runtime: {
      nodeVersion: process.version,
      v8Version: process.versions.v8,
      uptime: formatUptime(process.uptime())
    },
    system: {
      totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      cpus: os.cpus().length,
      uptime: formatUptime(os.uptime())
    },
    user: {
      username: os.userInfo().username,
      homedir: os.homedir()
    }
  };
  
  return info;
}

console.log('৬. BUG REPORT INFORMATION');
console.log('─'.repeat(50));
const bugInfo = generateBugReportInfo();
console.log(JSON.stringify(bugInfo, null, 2));
console.log('');

console.log('╔════════════════════════════════════════════╗');
console.log('║     SYSTEM INFO DASHBOARD COMPLETE         ║');
console.log('╚════════════════════════════════════════════╝');