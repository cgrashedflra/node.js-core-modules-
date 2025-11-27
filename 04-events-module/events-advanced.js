// Events Module - Advanced Patterns
// ==================================

const EventEmitter = require('events');

console.log('=== Events Module Advanced Patterns ===\n');

// Pattern 1: Event Bus (Central Event Management)
// ------------------------------------------------
console.log('১. Event Bus Pattern:');
console.log('─'.repeat(50));

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.events = {};
  }
  
  subscribe(eventName, callback) {
    this.on(eventName, callback);
    console.log(`✓ Subscribed to: ${eventName}`);
  }
  
  publish(eventName, data) {
    console.log(`📢 Publishing: ${eventName}`);
    this.emit(eventName, data);
  }
  
  unsubscribe(eventName, callback) {
    this.off(eventName, callback);
    console.log(`✗ Unsubscribed from: ${eventName}`);
  }
}

const bus = new EventBus();

// Multiple services subscribe করে
bus.subscribe('user-registered', (user) => {
  console.log(`  [Email] Welcome email sent to ${user.email}`);
});

bus.subscribe('user-registered', (user) => {
  console.log(`  [Analytics] User ${user.name} tracked`);
});

bus.subscribe('user-registered', (user) => {
  console.log(`  [Database] User ${user.name} saved`);
});

// Event publish করো
bus.publish('user-registered', {
  name: 'John Doe',
  email: 'john@example.com'
});
console.log('');

// Pattern 2: Promise-based Events
// --------------------------------
console.log('২. Promise-based Event Handler:');
console.log('─'.repeat(50));

class AsyncEventEmitter extends EventEmitter {
  async emitAsync(event, ...args) {
    const listeners = this.listeners(event);
    
    for (const listener of listeners) {
      await listener(...args);
    }
  }
}

const asyncEmitter = new AsyncEventEmitter();

asyncEmitter.on('process', async (data) => {
  console.log('  Step 1: Processing started...');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('  Step 1: Complete');
});

asyncEmitter.on('process', async (data) => {
  console.log('  Step 2: Processing started...');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('  Step 2: Complete');
});

(async () => {
  await asyncEmitter.emitAsync('process', 'data');
  console.log('All async handlers completed!\n');
})();

// Pattern 3: Event Queue with Rate Limiting
// ------------------------------------------
setTimeout(() => {
  console.log('৩. Event Queue with Rate Limiting:');
  console.log('─'.repeat(50));
  
  class RateLimitedEmitter extends EventEmitter {
    constructor(maxPerSecond = 5) {
      super();
      this.maxPerSecond = maxPerSecond;
      this.queue = [];
      this.processing = false;
    }
    
    emitRateLimited(event, ...args) {
      this.queue.push({ event, args });
      this.processQueue();
    }
    
    processQueue() {
      if (this.processing || this.queue.length === 0) return;
      
      this.processing = true;
      const interval = 1000 / this.maxPerSecond;
      
      const processNext = () => {
        if (this.queue.length === 0) {
          this.processing = false;
          return;
        }
        
        const { event, args } = this.queue.shift();
        this.emit(event, ...args);
        
        setTimeout(processNext, interval);
      };
      
      processNext();
    }
  }
  
  const rateLimited = new RateLimitedEmitter(2); // 2 events per second
  
  rateLimited.on('api-call', (id) => {
    console.log(`  API call ${id} at ${new Date().toLocaleTimeString()}`);
  });
  
  // 10টা events একসাথে emit করো
  for (let i = 1; i <= 10; i++) {
    rateLimited.emitRateLimited('api-call', i);
  }
  
  console.log('10 events queued, processing at 2 per second...\n');
}, 500);

// Pattern 4: Event Middleware Chain
// ----------------------------------
setTimeout(() => {
  console.log('৪. Event Middleware Chain:');
  console.log('─'.repeat(50));
  
  class MiddlewareEmitter extends EventEmitter {
    constructor() {
      super();
      this.middlewares = [];
    }
    
    use(middleware) {
      this.middlewares.push(middleware);
    }
    
    async emitWithMiddleware(event, data) {
      let processedData = data;
      
      // Run all middlewares
      for (const middleware of this.middlewares) {
        processedData = await middleware(processedData);
      }
      
      // Finally emit
      this.emit(event, processedData);
    }
  }
  
  const mwEmitter = new MiddlewareEmitter();
  
  // Add middlewares
  mwEmitter.use(async (data) => {
    console.log('  [Middleware 1] Validating...');
    data.validated = true;
    return data;
  });
  
  mwEmitter.use(async (data) => {
    console.log('  [Middleware 2] Sanitizing...');
    data.sanitized = true;
    return data;
  });
  
  mwEmitter.use(async (data) => {
    console.log('  [Middleware 3] Logging...');
    data.logged = true;
    return data;
  });
  
  mwEmitter.on('request', (data) => {
    console.log('  [Final Handler] Data received:', data);
  });
  
  (async () => {
    await mwEmitter.emitWithMiddleware('request', { user: 'John' });
    console.log('');
  })();
}, 6000);

// Pattern 5: Event History/Replay
// --------------------------------
setTimeout(() => {
  console.log('৫. Event History & Replay:');
  console.log('─'.repeat(50));
  
  class HistoryEmitter extends EventEmitter {
    constructor() {
      super();
      this.history = [];
      this.maxHistory = 10;
    }
    
    emitWithHistory(event, ...args) {
      // Save to history
      this.history.push({
        event,
        args,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last N events
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      
      this.emit(event, ...args);
    }
    
    getHistory() {
      return this.history;
    }
    
    replay() {
      console.log('Replaying history...');
      this.history.forEach(({ event, args }) => {
        this.emit(event, ...args);
      });
    }
  }
  
  const histEmitter = new HistoryEmitter();
  
  histEmitter.on('action', (action) => {
    console.log(`  Action: ${action}`);
  });
  
  // Emit some events
  histEmitter.emitWithHistory('action', 'Login');
  histEmitter.emitWithHistory('action', 'View Profile');
  histEmitter.emitWithHistory('action', 'Edit Settings');
  
  console.log('\nHistory:');
  histEmitter.getHistory().forEach((entry, i) => {
    console.log(`  ${i + 1}. ${entry.event} - ${entry.args[0]}`);
  });
  
  console.log('\n');
}, 7000);

// Pattern 6: Typed Events (Type Safety Pattern)
// ----------------------------------------------
setTimeout(() => {
  console.log('৬. Typed Events Pattern:');
  console.log('─'.repeat(50));
  
  class TypedEmitter extends EventEmitter {
    constructor() {
      super();
      this.eventTypes = {};
    }
    
    registerEvent(eventName, validator) {
      this.eventTypes[eventName] = validator;
    }
    
    emitTyped(eventName, data) {
      if (!this.eventTypes[eventName]) {
        throw new Error(`Event "${eventName}" not registered`);
      }
      
      const validator = this.eventTypes[eventName];
      if (!validator(data)) {
        throw new Error(`Invalid data for event "${eventName}"`);
      }
      
      this.emit(eventName, data);
    }
  }
  
  const typedEmitter = new TypedEmitter();
  
  // Register events with validators
  typedEmitter.registerEvent('user-login', (data) => {
    return data && typeof data.username === 'string' && typeof data.password === 'string';
  });
  
  typedEmitter.on('user-login', (data) => {
    console.log(`  User logged in: ${data.username}`);
  });
  
  // Valid emit
  try {
    typedEmitter.emitTyped('user-login', {
      username: 'john',
      password: 'secret'
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  // Invalid emit
  try {
    typedEmitter.emitTyped('user-login', { username: 'john' }); // missing password
  } catch (err) {
    console.error('  ✗ Validation failed:', err.message);
  }
  
  console.log('');
}, 8000);

// Pattern 7: Event Namespacing
// -----------------------------
setTimeout(() => {
  console.log('৭. Event Namespacing:');
  console.log('─'.repeat(50));
  
  class NamespacedEmitter extends EventEmitter {
    emitNamespaced(namespace, event, ...args) {
      const fullEvent = `${namespace}:${event}`;
      this.emit(fullEvent, ...args);
      
      // Also emit wildcard
      this.emit(`${namespace}:*`, event, ...args);
    }
    
    onNamespaced(namespace, event, callback) {
      const fullEvent = `${namespace}:${event}`;
      this.on(fullEvent, callback);
    }
    
    onNamespaceWildcard(namespace, callback) {
      this.on(`${namespace}:*`, callback);
    }
  }
  
  const nsEmitter = new NamespacedEmitter();
  
  // Listen to specific events
  nsEmitter.onNamespaced('user', 'login', (username) => {
    console.log(`  [Specific] User logged in: ${username}`);
  });
  
  nsEmitter.onNamespaced('user', 'logout', (username) => {
    console.log(`  [Specific] User logged out: ${username}`);
  });
  
  // Listen to all user events
  nsEmitter.onNamespaceWildcard('user', (event, ...args) => {
    console.log(`  [Wildcard] user:${event}`, args);
  });
  
  // Emit events
  nsEmitter.emitNamespaced('user', 'login', 'John');
  nsEmitter.emitNamespaced('user', 'logout', 'John');
  
  console.log('');
  console.log('=== Events Advanced Patterns Complete! ===');
}, 9000);