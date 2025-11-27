// Events Module - Real-world Applications
// ========================================

const EventEmitter = require('events');

console.log('=== Real-world Event-Driven Applications ===\n');

// Example 1: E-commerce Order System
// -----------------------------------
console.log('১. E-commerce Order System:');
console.log('─'.repeat(50));

class OrderSystem extends EventEmitter {
  constructor() {
    super();
    this.orders = [];
  }
  
  placeOrder(order) {
    order.id = `ORD-${Date.now()}`;
    order.status = 'pending';
    order.createdAt = new Date().toISOString();
    
    this.orders.push(order);
    
    console.log(`📦 Order placed: ${order.id}`);
    this.emit('order:placed', order);
    
    return order;
  }
  
  confirmPayment(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'paid';
      console.log(`💳 Payment confirmed: ${orderId}`);
      this.emit('order:paid', order);
    }
  }
  
  shipOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'shipped';
      console.log(`🚚 Order shipped: ${orderId}`);
      this.emit('order:shipped', order);
    }
  }
}

const orderSystem = new OrderSystem();

// Email Service
orderSystem.on('order:placed', (order) => {
  console.log(`  ✉️  [Email] Order confirmation sent to ${order.customer.email}`);
});

orderSystem.on('order:paid', (order) => {
  console.log(`  ✉️  [Email] Payment receipt sent`);
});

orderSystem.on('order:shipped', (order) => {
  console.log(`  ✉️  [Email] Shipping notification sent`);
});

// SMS Service
orderSystem.on('order:placed', (order) => {
  console.log(`  📱 [SMS] Order placed SMS sent to ${order.customer.phone}`);
});

// Inventory Service
orderSystem.on('order:paid', (order) => {
  console.log(`  📊 [Inventory] Stock reduced for items`);
});

// Analytics Service
orderSystem.on('order:placed', (order) => {
  console.log(`  📈 [Analytics] Order tracked`);
});

// Place an order
const order = orderSystem.placeOrder({
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+8801712345678'
  },
  items: [
    { name: 'Laptop', price: 50000, quantity: 1 }
  ],
  total: 50000
});

// Simulate workflow
setTimeout(() => orderSystem.confirmPayment(order.id), 500);
setTimeout(() => orderSystem.shipOrder(order.id), 1000);

console.log('');

// Example 2: Real-time Chat Application
// --------------------------------------
setTimeout(() => {
  console.log('২. Real-time Chat Application:');
  console.log('─'.repeat(50));
  
  class ChatRoom extends EventEmitter {
    constructor(name) {
      super();
      this.name = name;
      this.users = new Map();
      this.messages = [];
    }
    
    userJoin(userId, username) {
      this.users.set(userId, { username, joinedAt: Date.now() });
      console.log(`👤 ${username} joined ${this.name}`);
      this.emit('user:join', { userId, username });
    }
    
    userLeave(userId) {
      const user = this.users.get(userId);
      if (user) {
        this.users.delete(userId);
        console.log(`👤 ${user.username} left ${this.name}`);
        this.emit('user:leave', { userId, username: user.username });
      }
    }
    
    sendMessage(userId, message) {
      const user = this.users.get(userId);
      if (user) {
        const msg = {
          userId,
          username: user.username,
          message,
          timestamp: new Date().toISOString()
        };
        
        this.messages.push(msg);
        console.log(`💬 ${user.username}: ${message}`);
        this.emit('message', msg);
      }
    }
    
    userTyping(userId) {
      const user = this.users.get(userId);
      if (user) {
        this.emit('user:typing', { userId, username: user.username });
      }
    }
  }
  
  const chatRoom = new ChatRoom('General');
  
  // Notification handler
  chatRoom.on('user:join', ({ username }) => {
    console.log(`  🔔 System: ${username} has joined the chat`);
  });
  
  chatRoom.on('user:leave', ({ username }) => {
    console.log(`  🔔 System: ${username} has left the chat`);
  });
  
  chatRoom.on('message', (msg) => {
    console.log(`  📨 Broadcast to all users: ${msg.username}: ${msg.message}`);
  });
  
  chatRoom.on('user:typing', ({ username }) => {
    console.log(`  ⌨️  ${username} is typing...`);
  });
  
  // Simulate chat
  chatRoom.userJoin('user1', 'Alice');
  chatRoom.userJoin('user2', 'Bob');
  
  setTimeout(() => chatRoom.userTyping('user1'), 100);
  setTimeout(() => chatRoom.sendMessage('user1', 'Hello everyone!'), 200);
  setTimeout(() => chatRoom.sendMessage('user2', 'Hi Alice!'), 300);
  setTimeout(() => chatRoom.userLeave('user1'), 400);
  
  console.log('');
}, 1500);

// Example 3: File Upload Progress Monitor
// ----------------------------------------
setTimeout(() => {
  console.log('৩. File Upload Progress Monitor:');
  console.log('─'.repeat(50));
  
  class FileUploader extends EventEmitter {
    uploadFile(file) {
      const totalSize = file.size;
      let uploaded = 0;
      
      console.log(`📤 Uploading: ${file.name} (${totalSize} bytes)`);
      this.emit('upload:start', { file });
      
      const uploadInterval = setInterval(() => {
        uploaded += Math.floor(totalSize / 10);
        
        if (uploaded >= totalSize) {
          uploaded = totalSize;
          clearInterval(uploadInterval);
          
          this.emit('upload:progress', { file, uploaded, totalSize, percent: 100 });
          this.emit('upload:complete', { file });
          console.log(`✅ Upload complete: ${file.name}`);
        } else {
          const percent = Math.floor((uploaded / totalSize) * 100);
          this.emit('upload:progress', { file, uploaded, totalSize, percent });
        }
      }, 100);
    }
  }
  
  const uploader = new FileUploader();
  
  uploader.on('upload:start', ({ file }) => {
    console.log(`  🚀 Starting upload for ${file.name}`);
  });
  
  uploader.on('upload:progress', ({ file, percent }) => {
    const bar = '█'.repeat(percent / 5) + '░'.repeat(20 - percent / 5);
    console.log(`  Progress: [${bar}] ${percent}%`);
  });
  
  uploader.on('upload:complete', ({ file }) => {
    console.log(`  ✨ ${file.name} uploaded successfully!`);
  });
  
  // Simulate upload
  uploader.uploadFile({ name: 'document.pdf', size: 1000 });
  
  console.log('');
}, 2000);

// Example 4: Task Queue System
// -----------------------------
setTimeout(() => {
  console.log('৪. Task Queue System:');
  console.log('─'.repeat(50));
  
  class TaskQueue extends EventEmitter {
    constructor() {
      super();
      this.queue = [];
      this.processing = false;
      this.completed = [];
      this.failed = [];
    }
    
    addTask(task) {
      this.queue.push(task);
      console.log(`➕ Task added: ${task.name}`);
      this.emit('task:added', task);
      
      if (!this.processing) {
        this.processNext();
      }
    }
    
    async processNext() {
      if (this.queue.length === 0) {
        this.processing = false;
        this.emit('queue:empty');
        return;
      }
      
      this.processing = true;
      const task = this.queue.shift();
      
      console.log(`⚙️  Processing: ${task.name}`);
      this.emit('task:processing', task);
      
      try {
        // Simulate task execution
        await new Promise(resolve => setTimeout(resolve, task.duration || 500));
        
        this.completed.push(task);
        console.log(`✅ Completed: ${task.name}`);
        this.emit('task:completed', task);
      } catch (err) {
        this.failed.push({ task, error: err });
        console.log(`❌ Failed: ${task.name}`);
        this.emit('task:failed', { task, error: err });
      }
      
      // Process next task
      this.processNext();
    }
    
    getStats() {
      return {
        pending: this.queue.length,
        completed: this.completed.length,
        failed: this.failed.length
      };
    }
  }
  
  const taskQueue = new TaskQueue();
  
  taskQueue.on('task:added', (task) => {
    console.log(`  📋 Queue size: ${taskQueue.queue.length}`);
  });
  
  taskQueue.on('task:completed', (task) => {
    const stats = taskQueue.getStats();
    console.log(`  📊 Stats - Pending: ${stats.pending}, Completed: ${stats.completed}`);
  });
  
  taskQueue.on('queue:empty', () => {
    console.log(`  🎉 All tasks completed!`);
    console.log(`  Final stats:`, taskQueue.getStats());
  });
  
  // Add tasks
  taskQueue.addTask({ name: 'Send Email', duration: 300 });
  taskQueue.addTask({ name: 'Process Image', duration: 500 });
  taskQueue.addTask({ name: 'Generate Report', duration: 400 });
  
  console.log('');
}, 3500);

// Example 5: System Health Monitor
// ---------------------------------
setTimeout(() => {
  console.log('৫. System Health Monitor:');
  console.log('─'.repeat(50));
  
  class HealthMonitor extends EventEmitter {
    constructor(thresholds) {
      super();
      this.thresholds = thresholds;
      this.metrics = {};
    }
    
    checkMetric(name, value) {
      this.metrics[name] = value;
      
      const threshold = this.thresholds[name];
      if (!threshold) return;
      
      if (value > threshold.critical) {
        console.log(`🔴 CRITICAL: ${name} = ${value} (threshold: ${threshold.critical})`);
        this.emit('health:critical', { metric: name, value, threshold: threshold.critical });
      } else if (value > threshold.warning) {
        console.log(`🟡 WARNING: ${name} = ${value} (threshold: ${threshold.warning})`);
        this.emit('health:warning', { metric: name, value, threshold: threshold.warning });
      } else {
        console.log(`🟢 OK: ${name} = ${value}`);
        this.emit('health:ok', { metric: name, value });
      }
    }
    
    startMonitoring(interval = 1000) {
      console.log('🔍 Monitoring started...');
      
      this.monitoringInterval = setInterval(() => {
        // Simulate metrics
        const cpuUsage = Math.floor(Math.random() * 100);
        const memoryUsage = Math.floor(Math.random() * 100);
        
        this.checkMetric('cpu', cpuUsage);
        this.checkMetric('memory', memoryUsage);
      }, interval);
    }
    
    stopMonitoring() {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        console.log('🛑 Monitoring stopped');
      }
    }
  }
  
  const monitor = new HealthMonitor({
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 80, critical: 95 }
  });
  
  monitor.on('health:critical', ({ metric, value }) => {
    console.log(`  🚨 ALERT: ${metric} reached critical level!`);
    console.log(`  📧 Sending alert to admin...`);
  });
  
  monitor.on('health:warning', ({ metric, value }) => {
    console.log(`  ⚠️  Warning logged for ${metric}`);
  });
  
  monitor.startMonitoring(800);
  
  // Stop after 5 seconds
  setTimeout(() => {
    monitor.stopMonitoring();
    console.log('\n=== Real-world Examples Complete! ===');
  }, 5000);
  
}, 7000);