// Events Module - Basic Examples
// ==============================

const EventEmitter = require('events');

console.log('=== Events Module শিখি ===\n');

// ১. Basic EventEmitter তৈরি করা
// --------------------------------
console.log('১. Basic EventEmitter:');
console.log('─'.repeat(50));

const emitter = new EventEmitter();

// Event listener add করা
emitter.on('greet', () => {
  console.log('Hello! Event triggered!');
});

// Event emit (trigger) করা
emitter.emit('greet');
console.log('');

// ২. Event এ Data পাঠানো
// ------------------------
console.log('২. Event with Data:');
console.log('─'.repeat(50));

emitter.on('user-login', (username, time) => {
  console.log(`User ${username} logged in at ${time}`);
});

emitter.emit('user-login', 'John', new Date().toLocaleTimeString());
emitter.emit('user-login', 'Sarah', new Date().toLocaleTimeString());
console.log('');

// ৩. Multiple Listeners (একই event, অনেক listeners)
// ---------------------------------------------------
console.log('৩. Multiple Listeners:');
console.log('─'.repeat(50));

emitter.on('order-placed', (orderId) => {
  console.log(`[Email Service] Sending confirmation for order ${orderId}`);
});

emitter.on('order-placed', (orderId) => {
  console.log(`[SMS Service] Sending SMS for order ${orderId}`);
});

emitter.on('order-placed', (orderId) => {
  console.log(`[Inventory] Updating stock for order ${orderId}`);
});

// একটা event emit করলে সব listeners চলবে
emitter.emit('order-placed', 'ORD-12345');
console.log('');

// ৪. once() - শুধু একবার listen করা
// ------------------------------------
console.log('৪. once() - One-time Listener:');
console.log('─'.repeat(50));

emitter.once('app-start', () => {
  console.log('App started! (This will run only once)');
});

emitter.emit('app-start'); // চলবে
emitter.emit('app-start'); // চলবে না
emitter.emit('app-start'); // চলবে না
console.log('');

// ৫. Listener Remove করা
// -----------------------
console.log('৫. Removing Listeners:');
console.log('─'.repeat(50));

function onData(data) {
  console.log('Data received:', data);
}

emitter.on('data', onData);

emitter.emit('data', 'First'); // চলবে

// Listener remove করো
emitter.off('data', onData);

emitter.emit('data', 'Second'); // চলবে না (listener removed)
console.log('');

// ৬. Error Event (Special Event)
// -------------------------------
console.log('৬. Error Event Handling:');
console.log('─'.repeat(50));

const errorEmitter = new EventEmitter();

// Error listener না থাকলে app crash হবে
errorEmitter.on('error', (err) => {
  console.error('Error caught:', err.message);
});

// Error emit করো
errorEmitter.emit('error', new Error('Something went wrong!'));
console.log('App continues running because error was handled\n');

// ৭. Listener Count
// -----------------
console.log('৭. Listener Count:');
console.log('─'.repeat(50));

emitter.on('test', () => {});
emitter.on('test', () => {});
emitter.on('test', () => {});

console.log('Number of "test" listeners:', emitter.listenerCount('test'));
console.log('');

// ৮. Get All Event Names
// ----------------------
console.log('৮. All Event Names:');
console.log('─'.repeat(50));

console.log('Registered events:', emitter.eventNames());
console.log('');

// ৯. Remove All Listeners
// -----------------------
console.log('৯. Remove All Listeners:');
console.log('─'.repeat(50));

emitter.on('cleanup', () => console.log('Cleanup 1'));
emitter.on('cleanup', () => console.log('Cleanup 2'));
emitter.on('cleanup', () => console.log('Cleanup 3'));

console.log('Before removal:', emitter.listenerCount('cleanup'));
emitter.removeAllListeners('cleanup');
console.log('After removal:', emitter.listenerCount('cleanup'));
console.log('');

// ১০. Prepend Listener (প্রথমে add করা)
// ---------------------------------------
console.log('১০. Prepend Listener:');
console.log('─'.repeat(50));

const prependEmitter = new EventEmitter();

prependEmitter.on('message', () => {
  console.log('Second listener');
});

prependEmitter.prependListener('message', () => {
  console.log('First listener (prepended)');
});

prependEmitter.emit('message');
console.log('');

// ১১. Event Arguments
// -------------------
console.log('১১. Multiple Arguments:');
console.log('─'.repeat(50));

emitter.on('payment', (orderId, amount, currency, status) => {
  console.log(`Payment Details:`);
  console.log(`  Order: ${orderId}`);
  console.log(`  Amount: ${amount} ${currency}`);
  console.log(`  Status: ${status}`);
});

emitter.emit('payment', 'ORD-999', 1500, 'BDT', 'success');
console.log('');

// ১২. Listener Function Reference
// --------------------------------
console.log('১২. Get Listeners:');
console.log('─'.repeat(50));

function handler1() { console.log('Handler 1'); }
function handler2() { console.log('Handler 2'); }

emitter.on('demo', handler1);
emitter.on('demo', handler2);

const listeners = emitter.listeners('demo');
console.log('Number of demo listeners:', listeners.length);
console.log('');

// ১৩. setMaxListeners (Memory Leak Warning)
// ------------------------------------------
console.log('১৩. Max Listeners:');
console.log('─'.repeat(50));

const maxEmitter = new EventEmitter();

// Default max is 10
console.log('Default max listeners:', EventEmitter.defaultMaxListeners);

// বেশি listeners add করলে warning দেবে
maxEmitter.setMaxListeners(3); // Max 3 set করলাম

maxEmitter.on('test', () => {});
maxEmitter.on('test', () => {});
maxEmitter.on('test', () => {});
maxEmitter.on('test', () => {}); // Warning দেবে (exceeded max)

console.log('');

// ১৪. newListener and removeListener Events
// ------------------------------------------
console.log('১৪. Meta Events (newListener, removeListener):');
console.log('─'.repeat(50));

const metaEmitter = new EventEmitter();

// নতুন listener add হলে এটা trigger হবে
metaEmitter.on('newListener', (eventName, listener) => {
  console.log(`New listener added for event: ${eventName}`);
});

// Listener remove হলে এটা trigger হবে
metaEmitter.on('removeListener', (eventName, listener) => {
  console.log(`Listener removed for event: ${eventName}`);
});

// এখন listener add করো
metaEmitter.on('test-event', () => {});

// Listener remove করো
const testFn = () => {};
metaEmitter.on('another-event', testFn);
metaEmitter.off('another-event', testFn);

console.log('');

// ১৫. Custom EventEmitter Class
// ------------------------------
console.log('১৫. Custom EventEmitter Class:');
console.log('─'.repeat(50));

class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.name = 'MyCustomEmitter';
  }
  
  doSomething(data) {
    console.log(`${this.name} is processing:`, data);
    this.emit('done', data);
  }
}

const myEmitter = new MyEmitter();

myEmitter.on('done', (data) => {
  console.log('Processing completed for:', data);
});

myEmitter.doSomething('Task 1');
console.log('');

console.log('=== Events Module Basics Complete! ===');