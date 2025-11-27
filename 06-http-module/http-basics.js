// HTTP Module - Basic Examples
// =============================

const http = require('http');

console.log('=== HTTP Module শিখি ===\n');

// ১. সবচেয়ে Simple Server
// -------------------------
console.log('১. Simple HTTP Server:');
console.log('─'.repeat(50));

const simpleServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js HTTP Server!');
});

const PORT1 = 3000;

simpleServer.listen(PORT1, () => {
  console.log(`✅ Simple server running at http://localhost:${PORT1}`);
  console.log('   Open browser and visit the URL');
  console.log('   Press Ctrl+C to stop\n');
});

// Server close করার জন্য
setTimeout(() => {
  simpleServer.close(() => {
    console.log('Simple server stopped\n');
    startExample2();
  });
}, 3000);

// ২. Request Info দেখা
// ---------------------
function startExample2() {
  console.log('২. Request Information:');
  console.log('─'.repeat(50));
  
  const infoServer = http.createServer((req, res) => {
    console.log('\n📨 New Request Received:');
    console.log('  URL:', req.url);
    console.log('  Method:', req.method);
    console.log('  Headers:', JSON.stringify(req.headers, null, 2));
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Request Information</h1>
      <p><strong>URL:</strong> ${req.url}</p>
      <p><strong>Method:</strong> ${req.method}</p>
      <p><strong>User-Agent:</strong> ${req.headers['user-agent']}</p>
    `);
  });
  
  const PORT2 = 3001;
  
  infoServer.listen(PORT2, () => {
    console.log(`✅ Info server running at http://localhost:${PORT2}`);
    console.log('   Visit the URL to see request details\n');
  });
  
  setTimeout(() => {
    infoServer.close(() => {
      console.log('Info server stopped\n');
      startExample3();
    });
  }, 3000);
}

// ৩. Different Response Types
// ----------------------------
function startExample3() {
  console.log('৩. Different Content Types:');
  console.log('─'.repeat(50));
  
  const contentServer = http.createServer((req, res) => {
    if (req.url === '/') {
      // HTML response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>HTML Response</h1><p>This is HTML content</p>');
      
    } else if (req.url === '/json') {
      // JSON response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'JSON Response',
        data: { name: 'John', age: 30 }
      }));
      
    } else if (req.url === '/text') {
      // Plain text response
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Plain text response');
      
    } else {
      // 404 Not Found
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });
  
  const PORT3 = 3002;
  
  contentServer.listen(PORT3, () => {
    console.log(`✅ Content server running at http://localhost:${PORT3}`);
    console.log('   Routes:');
    console.log('   - http://localhost:3002/ (HTML)');
    console.log('   - http://localhost:3002/json (JSON)');
    console.log('   - http://localhost:3002/text (Text)');
    console.log('   - http://localhost:3002/anything (404)\n');
  });
  
  setTimeout(() => {
    contentServer.close(() => {
      console.log('Content server stopped\n');
      startExample4();
    });
  }, 3000);
}

// ৪. Status Codes
// ---------------
function startExample4() {
  console.log('৪. HTTP Status Codes:');
  console.log('─'.repeat(50));
  
  const statusServer = http.createServer((req, res) => {
    if (req.url === '/success') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('200 OK - Success!');
      
    } else if (req.url === '/created') {
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('201 Created - Resource created!');
      
    } else if (req.url === '/redirect') {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      
    } else if (req.url === '/bad-request') {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('400 Bad Request - Invalid request!');
      
    } else if (req.url === '/unauthorized') {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('401 Unauthorized - Login required!');
      
    } else if (req.url === '/forbidden') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden - Access denied!');
      
    } else if (req.url === '/not-found') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found - Page not found!');
      
    } else if (req.url === '/server-error') {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error!');
      
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>HTTP Status Codes Demo</h1>
        <ul>
          <li><a href="/success">200 OK</a></li>
          <li><a href="/created">201 Created</a></li>
          <li><a href="/redirect">302 Redirect</a></li>
          <li><a href="/bad-request">400 Bad Request</a></li>
          <li><a href="/unauthorized">401 Unauthorized</a></li>
          <li><a href="/forbidden">403 Forbidden</a></li>
          <li><a href="/not-found">404 Not Found</a></li>
          <li><a href="/server-error">500 Server Error</a></li>
        </ul>
      `);
    }
  });
  
  const PORT4 = 3003;
  
  statusServer.listen(PORT4, () => {
    console.log(`✅ Status server running at http://localhost:${PORT4}`);
    console.log('   Visit to see different HTTP status codes\n');
  });
  
  setTimeout(() => {
    statusServer.close(() => {
      console.log('Status server stopped\n');
      startExample5();
    });
  }, 3000);
}

// ৫. Headers Management
// ---------------------
function startExample5() {
  console.log('৫. Custom Headers:');
  console.log('─'.repeat(50));
  
  const headerServer = http.createServer((req, res) => {
    // Multiple ways to set headers
    
    // Method 1: writeHead
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'X-Custom-Header': 'My Custom Value',
      'X-Powered-By': 'Node.js'
    });
    
    // Method 2: setHeader (before writeHead)
    // res.setHeader('Content-Type', 'text/html');
    // res.setHeader('X-Custom-Header', 'Value');
    
    res.end(`
      <h1>Custom Headers</h1>
      <p>Check browser DevTools → Network → Headers to see custom headers</p>
      <ul>
        <li>X-Custom-Header: My Custom Value</li>
        <li>X-Powered-By: Node.js</li>
      </ul>
    `);
  });
  
  const PORT5 = 3004;
  
  headerServer.listen(PORT5, () => {
    console.log(`✅ Header server running at http://localhost:${PORT5}`);
    console.log('   Open DevTools → Network to see custom headers\n');
  });
  
  setTimeout(() => {
    headerServer.close(() => {
      console.log('Header server stopped\n');
      startExample6();
    });
  }, 3000);
}

// ৬. Query Parameters
// -------------------
function startExample6() {
  console.log('৬. Query Parameters:');
  console.log('─'.repeat(50));
  
  const url = require('url');
  
  const queryServer = http.createServer((req, res) => {
    // Parse URL and query string
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    if (pathname === '/search') {
      const searchTerm = query.q || 'nothing';
      const page = query.page || 1;
      
      res.end(`
        <h1>Search Results</h1>
        <p>You searched for: <strong>${searchTerm}</strong></p>
        <p>Page: ${page}</p>
        <hr>
        <form action="/search" method="GET">
          <input type="text" name="q" placeholder="Search...">
          <input type="number" name="page" placeholder="Page" value="1">
          <button type="submit">Search</button>
        </form>
      `);
    } else {
      res.end(`
        <h1>Query Parameters Demo</h1>
        <p>Try: <a href="/search?q=nodejs&page=1">/search?q=nodejs&page=1</a></p>
        <p>Try: <a href="/search?q=javascript&page=2">/search?q=javascript&page=2</a></p>
      `);
    }
  });
  
  const PORT6 = 3005;
  
  queryServer.listen(PORT6, () => {
    console.log(`✅ Query server running at http://localhost:${PORT6}`);
    console.log('   Visit to test query parameters\n');
  });
  
  setTimeout(() => {
    queryServer.close(() => {
      console.log('Query server stopped\n');
      console.log('=== HTTP Basics Examples Complete! ===');
      console.log('Run other example files to learn more!\n');
    });
  }, 3000);
}

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Error:', err.message);
});