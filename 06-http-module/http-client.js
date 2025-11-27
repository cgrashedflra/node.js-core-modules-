// HTTP Module - HTTP Client (Making Requests)
// ============================================

const http = require('http');
const https = require('https');

console.log('=== HTTP Client Examples ===\n');

// ১. Simple GET Request
// ----------------------
console.log('১. Simple GET Request:');
console.log('─'.repeat(50));

function simpleGET() {
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/posts/1',
    method: 'GET'
  };
  
  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\nResponse Body:');
      console.log(JSON.parse(data));
      console.log('');
      
      // Next example
      setTimeout(getRequest, 1000);
    });
  });
  
  req.on('error', (err) => {
    console.error('Request error:', err.message);
  });
  
  req.end();
}

simpleGET();

// ২. GET Request with Query Parameters
// -------------------------------------
function getRequest() {
  console.log('২. GET Request with Query:');
  console.log('─'.repeat(50));
  
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/posts?userId=1',
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js HTTP Client'
    }
  };
  
  https.get(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const posts = JSON.parse(data);
      console.log(`Received ${posts.length} posts`);
      console.log('First post:', posts[0]);
      console.log('');
      
      setTimeout(postRequest, 1000);
    });
  });
}

// ৩. POST Request
// ---------------
function postRequest() {
  console.log('৩. POST Request (Create Resource):');
  console.log('─'.repeat(50));
  
  const postData = JSON.stringify({
    title: 'My New Post',
    body: 'This is the content of my post',
    userId: 1
  });
  
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Created post:');
      console.log(JSON.parse(data));
      console.log('');
      
      setTimeout(putRequest, 1000);
    });
  });
  
  req.on('error', (err) => {
    console.error('Error:', err.message);
  });
  
  // Write data to request body
  req.write(postData);
  req.end();
}

// ৪. PUT Request
// --------------
function putRequest() {
  console.log('৪. PUT Request (Update Resource):');
  console.log('─'.repeat(50));
  
  const putData = JSON.stringify({
    id: 1,
    title: 'Updated Title',
    body: 'Updated content',
    userId: 1
  });
  
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/posts/1',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData)
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Updated post:');
      console.log(JSON.parse(data));
      console.log('');
      
      setTimeout(deleteRequest, 1000);
    });
  });
  
  req.write(putData);
  req.end();
}

// ৫. DELETE Request
// -----------------
function deleteRequest() {
  console.log('৫. DELETE Request:');
  console.log('─'.repeat(50));
  
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/posts/1',
    method: 'DELETE'
  };
  
  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    res.on('data', () => {});
    res.on('end', () => {
      console.log('✅ Resource deleted');
      console.log('');
      
      setTimeout(downloadFile, 1000);
    });
  });
  
  req.end();
}

// ৬. Download File (Stream)
// -------------------------
function downloadFile() {
  console.log('৬. Download File with Stream:');
  console.log('─'.repeat(50));
  
  const fs = require('fs');
  const path = require('path');
  
  const file = fs.createWriteStream(path.join(__dirname, 'downloaded.json'));
  
  https.get('https://jsonplaceholder.typicode.com/posts', (res) => {
    console.log('Downloading...');
    
    let downloaded = 0;
    
    res.on('data', (chunk) => {
      downloaded += chunk.length;
      process.stdout.write(`\r  Downloaded: ${(downloaded / 1024).toFixed(2)} KB`);
    });
    
    res.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log('\n✅ File downloaded successfully');
      console.log('');
      
      setTimeout(makeLocalRequest, 1000);
    });
  });
}

// ৭. Make Request to Local Server
// --------------------------------
function makeLocalRequest() {
  console.log('৭. Request to Local Server:');
  console.log('─'.repeat(50));
  console.log('(Make sure http-server.js is running on port 3000)\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Successfully connected to local server');
        console.log('Response:', JSON.parse(data));
      } else {
        console.log('Status:', res.statusCode);
      }
      console.log('');
      
      setTimeout(helperFunctions, 1000);
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Local server not running');
    console.log('   Start it with: node http-server.js');
    console.log('');
    
    setTimeout(helperFunctions, 1000);
  });
  
  req.end();
}

// ৮. Helper Functions for Cleaner Code
// -------------------------------------
function helperFunctions() {
  console.log('৮. Helper Functions for API Calls:');
  console.log('─'.repeat(50));
  
  // Helper: Make GET request
  function httpGet(url, callback) {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => callback(null, JSON.parse(data)));
    }).on('error', err => callback(err, null));
  }
  
  // Helper: Make POST request
  function httpPost(url, postData, callback) {
    const data = JSON.stringify(postData);
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => callback(null, JSON.parse(responseData)));
    });
    
    req.on('error', err => callback(err, null));
    req.write(data);
    req.end();
  }
  
  // Test helpers
  console.log('Testing helper functions...\n');
  
  httpGet('https://jsonplaceholder.typicode.com/users/1', (err, data) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    console.log('GET helper result:', data);
  });
  
  setTimeout(() => {
    httpPost('https://jsonplaceholder.typicode.com/posts', {
      title: 'Test Post',
      body: 'Test body',
      userId: 1
    }, (err, data) => {
      if (err) {
        console.error('Error:', err.message);
        return;
      }
      console.log('POST helper result:', data);
      console.log('');
      
      setTimeout(() => {
        console.log('=== HTTP Client Examples Complete! ===');
      }, 1000);
    });
  }, 1000);
}

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled error:', err.message);
});