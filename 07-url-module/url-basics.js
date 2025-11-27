// URL Module - Basic Examples
// ============================

const url = require('url');

console.log('=== URL Module শিখি ===\n');

// ১. Legacy API - url.parse() (Old way)
// --------------------------------------
console.log('১. Legacy API - url.parse():');
console.log('─'.repeat(50));

const urlString = 'https://user:pass@example.com:8080/path/to/page?name=john&age=30&city=dhaka#section';

// Parse without query parsing
const parsed1 = url.parse(urlString);
console.log('Without query parsing:');
console.log(parsed1);
console.log('');

// Parse with query parsing (true parameter)
const parsed2 = url.parse(urlString, true);
console.log('With query parsing (parseQueryString: true):');
console.log('Protocol:', parsed2.protocol);
console.log('Auth:', parsed2.auth);
console.log('Hostname:', parsed2.hostname);
console.log('Port:', parsed2.port);
console.log('Pathname:', parsed2.pathname);
console.log('Search:', parsed2.search);
console.log('Query:', parsed2.query); // Object
console.log('Hash:', parsed2.hash);
console.log('');

// ২. Modern API - WHATWG URL (Recommended)
// ----------------------------------------
console.log('২. Modern API - WHATWG URL (Recommended):');
console.log('─'.repeat(50));

const myURL = new URL(urlString);

console.log('Complete URL:', myURL.href);
console.log('Protocol:', myURL.protocol);
console.log('Username:', myURL.username);
console.log('Password:', myURL.password);
console.log('Hostname:', myURL.hostname);
console.log('Host:', myURL.host); // hostname + port
console.log('Port:', myURL.port);
console.log('Pathname:', myURL.pathname);
console.log('Search:', myURL.search);
console.log('SearchParams:', myURL.searchParams);
console.log('Hash:', myURL.hash);
console.log('Origin:', myURL.origin);
console.log('');

// ৩. URLSearchParams - Query String Handling
// -------------------------------------------
console.log('৩. URLSearchParams - Query String:');
console.log('─'.repeat(50));

const params = myURL.searchParams;

// Get single value
console.log('Name:', params.get('name'));
console.log('Age:', params.get('age'));
console.log('City:', params.get('city'));
console.log('');

// Check if parameter exists
console.log('Has "name"?', params.has('name'));
console.log('Has "email"?', params.has('email'));
console.log('');

// Get all values (for multiple same-name params)
const multiURL = new URL('https://example.com?tag=nodejs&tag=javascript&tag=react');
const tags = multiURL.searchParams.getAll('tag');
console.log('All tags:', tags);
console.log('');

// Iterate over all parameters
console.log('All parameters:');
for (const [key, value] of params.entries()) {
  console.log(`  ${key}: ${value}`);
}
console.log('');

// ৪. Creating URLSearchParams from scratch
// ----------------------------------------
console.log('৪. Creating Query String:');
console.log('─'.repeat(50));

const searchParams = new URLSearchParams();

searchParams.append('search', 'nodejs tutorial');
searchParams.append('page', '1');
searchParams.append('limit', '10');
searchParams.append('sort', 'date');

console.log('Query string:', searchParams.toString());
console.log('');

// From object
const params2 = new URLSearchParams({
  name: 'John Doe',
  email: 'john@example.com',
  country: 'Bangladesh'
});

console.log('From object:', params2.toString());
console.log('');

// From string
const params3 = new URLSearchParams('foo=bar&name=john&age=30');
console.log('From string:', params3.toString());
console.log('Get foo:', params3.get('foo'));
console.log('');

// ৫. Modifying URL Parameters
// ----------------------------
console.log('৫. Modifying URL Parameters:');
console.log('─'.repeat(50));

const editURL = new URL('https://example.com/search?q=nodejs&page=1');

console.log('Original:', editURL.href);

// Set/Update parameter
editURL.searchParams.set('page', '2');
editURL.searchParams.set('limit', '20');

console.log('After set:', editURL.href);

// Append parameter
editURL.searchParams.append('sort', 'date');
console.log('After append:', editURL.href);

// Delete parameter
editURL.searchParams.delete('limit');
console.log('After delete:', editURL.href);
console.log('');

// ৬. url.format() - Creating URL from Object
// -------------------------------------------
console.log('৬. url.format() - Build URL:');
console.log('─'.repeat(50));

const urlObject = {
  protocol: 'https:',
  hostname: 'example.com',
  port: '8080',
  pathname: '/api/users',
  search: '?page=1&limit=10'
};

const formatted = url.format(urlObject);
console.log('Formatted URL:', formatted);
console.log('');

// Modern way
const modernURL = new URL('https://example.com');
modernURL.pathname = '/api/users';
modernURL.searchParams.set('page', '1');
modernURL.searchParams.set('limit', '10');
modernURL.port = '8080';

console.log('Modern way:', modernURL.href);
console.log('');

// ৭. Relative URLs
// ----------------
console.log('৭. Relative URLs:');
console.log('─'.repeat(50));

const baseURL = 'https://example.com/products/';

// Resolve relative URLs
const url1 = new URL('item-1', baseURL);
console.log('Relative "item-1":', url1.href);

const url2 = new URL('/categories', baseURL);
console.log('Absolute "/categories":', url2.href);

const url3 = new URL('../about', baseURL);
console.log('Parent "../about":', url3.href);

const url4 = new URL('?page=2', baseURL);
console.log('Query "?page=2":', url4.href);
console.log('');

// Legacy API
console.log('Legacy url.resolve():');
console.log(url.resolve('https://example.com/path/', 'file.html'));
console.log(url.resolve('https://example.com/path/', '/file.html'));
console.log(url.resolve('https://example.com/path/', '../file.html'));
console.log('');

// ৮. URL Validation
// -----------------
console.log('৮. URL Validation:');
console.log('─'.repeat(50));

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

console.log('Valid URLs:');
console.log('  https://example.com:', isValidURL('https://example.com'));
console.log('  http://localhost:3000:', isValidURL('http://localhost:3000'));
console.log('  ftp://ftp.example.com:', isValidURL('ftp://ftp.example.com'));

console.log('\nInvalid URLs:');
console.log('  example.com:', isValidURL('example.com'));
console.log('  //example.com:', isValidURL('//example.com'));
console.log('  not a url:', isValidURL('not a url'));
console.log('');

// ৯. Special Characters and Encoding
// -----------------------------------
console.log('৯. URL Encoding:');
console.log('─'.repeat(50));

const specialURL = new URL('https://example.com/search');

// Spaces and special chars automatically encoded
specialURL.searchParams.set('q', 'hello world');
specialURL.searchParams.set('name', 'জন ডো'); // Bangla text
specialURL.searchParams.set('email', 'john+test@example.com');

console.log('Encoded URL:', specialURL.href);
console.log('');

// Manual encoding/decoding
console.log('Manual encoding:');
const text = 'Hello World! বাংলা';
const encoded = encodeURIComponent(text);
const decoded = decodeURIComponent(encoded);

console.log('Original:', text);
console.log('Encoded:', encoded);
console.log('Decoded:', decoded);
console.log('');

// ১০. Comparing URLs
// ------------------
console.log('১০. Comparing URLs:');
console.log('─'.repeat(50));

const urlA = new URL('https://example.com/path?b=2&a=1');
const urlB = new URL('https://example.com/path?a=1&b=2');

console.log('URL A:', urlA.href);
console.log('URL B:', urlB.href);
console.log('Are they equal?', urlA.href === urlB.href);

// Sort parameters for comparison
urlA.searchParams.sort();
urlB.searchParams.sort();

console.log('After sorting:');
console.log('URL A:', urlA.href);
console.log('URL B:', urlB.href);
console.log('Are they equal now?', urlA.href === urlB.href);
console.log('');

// ১১. Extract Domain/Subdomain
// ----------------------------
console.log('১১. Extract Parts:');
console.log('─'.repeat(50));

const complexURL = new URL('https://blog.api.example.com:8080/posts/123?id=456');

console.log('Full hostname:', complexURL.hostname);
console.log('Origin:', complexURL.origin);

// Extract subdomain
const parts = complexURL.hostname.split('.');
if (parts.length > 2) {
  console.log('Subdomain:', parts.slice(0, -2).join('.'));
  console.log('Domain:', parts.slice(-2).join('.'));
}

// Extract path segments
const pathParts = complexURL.pathname.split('/').filter(p => p);
console.log('Path segments:', pathParts);
console.log('First segment:', pathParts[0]);
console.log('Last segment:', pathParts[pathParts.length - 1]);
console.log('');

// ১২. Data URLs
// -------------
console.log('১২. Data URLs:');
console.log('─'.repeat(50));

// Data URL for images, files
const dataURL = 'data:text/plain;charset=utf-8;base64,SGVsbG8gV29ybGQh';
const parsedData = new URL(dataURL);

console.log('Protocol:', parsedData.protocol);
console.log('Full URL:', parsedData.href);
console.log('');

console.log('=== URL Module Basics Complete! ===');