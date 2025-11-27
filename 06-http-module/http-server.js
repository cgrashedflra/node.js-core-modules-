// HTTP Module - Complete Server with Routing
// ===========================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

console.log('=== Complete HTTP Server ===\n');

// In-memory data store
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
];

// Helper: Send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Helper: Send HTML response
function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(html);
}

// Helper: Parse request body
function parseBody(req, callback) {
  let body = '';
  
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      callback(null, parsed);
    } catch (err) {
      callback(err, null);
    }
  });
}

// Helper: Serve static file
function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 File Not Found</h1>');
      return;
    }
    
    // Determine content type
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Create Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;
  
  console.log(`${method} ${pathname}`);
  
  // ============================================
  // Routes
  // ============================================
  
  // Home Page
  if (pathname === '/' && method === 'GET') {
    sendHTML(res, 200, `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Node.js HTTP Server</title>
        <style>
          body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .nav { background: #f4f4f4; padding: 10px; margin: 20px 0; }
          .nav a { margin-right: 15px; text-decoration: none; color: #007bff; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🚀 Node.js HTTP Server</h1>
        <p>Welcome to the raw Node.js HTTP server!</p>
        
        <div class="nav">
          <strong>Available Routes:</strong><br><br>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api/users">Users API</a>
          <a href="/api/time">Time API</a>
        </div>
        
        <h2>API Endpoints:</h2>
        <ul>
          <li><code>GET /api/users</code> - Get all users</li>
          <li><code>GET /api/users/:id</code> - Get user by ID</li>
          <li><code>POST /api/users</code> - Create new user</li>
          <li><code>PUT /api/users/:id</code> - Update user</li>
          <li><code>DELETE /api/users/:id</code> - Delete user</li>
          <li><code>GET /api/time</code> - Get current time</li>
        </ul>
        
        <h2>Test API with cURL:</h2>
        <pre>
# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create new user
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice","email":"alice@example.com"}'
        </pre>
      </body>
      </html>
    `);
  }
  
  // About Page
  else if (pathname === '/about' && method === 'GET') {
    sendHTML(res, 200, `
      <!DOCTYPE html>
      <html>
      <head>
        <title>About - Node.js Server</title>
        <style>
          body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        </style>
      </head>
      <body>
        <h1>About This Server</h1>
        <p>This is a simple HTTP server built with raw Node.js (no Express).</p>
        <p><a href="/">← Back to Home</a></p>
      </body>
      </html>
    `);
  }
  
  // API: Get all users
  else if (pathname === '/api/users' && method === 'GET') {
    sendJSON(res, 200, {
      success: true,
      count: users.length,
      data: users
    });
  }
  
  // API: Get user by ID
  else if (pathname.match(/^\/api\/users\/\d+$/) && method === 'GET') {
    const id = parseInt(pathname.split('/')[3]);
    const user = users.find(u => u.id === id);
    
    if (user) {
      sendJSON(res, 200, { success: true, data: user });
    } else {
      sendJSON(res, 404, { success: false, message: 'User not found' });
    }
  }
  
  // API: Create new user
  else if (pathname === '/api/users' && method === 'POST') {
    parseBody(req, (err, data) => {
      if (err || !data.name || !data.email) {
        sendJSON(res, 400, { 
          success: false, 
          message: 'Invalid data. Name and email required.' 
        });
        return;
      }
      
      const newUser = {
        id: users.length + 1,
        name: data.name,
        email: data.email
      };
      
      users.push(newUser);
      
      sendJSON(res, 201, {
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    });
  }
  
  // API: Update user
  else if (pathname.match(/^\/api\/users\/\d+$/) && method === 'PUT') {
    const id = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      sendJSON(res, 404, { success: false, message: 'User not found' });
      return;
    }
    
    parseBody(req, (err, data) => {
      if (err) {
        sendJSON(res, 400, { success: false, message: 'Invalid data' });
        return;
      }
      
      users[userIndex] = {
        ...users[userIndex],
        ...data
      };
      
      sendJSON(res, 200, {
        success: true,
        message: 'User updated successfully',
        data: users[userIndex]
      });
    });
  }
  
  // API: Delete user
  else if (pathname.match(/^\/api\/users\/\d+$/) && method === 'DELETE') {
    const id = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      sendJSON(res, 404, { success: false, message: 'User not found' });
      return;
    }
    
    users.splice(userIndex, 1);
    
    sendJSON(res, 200, {
      success: true,
      message: 'User deleted successfully'
    });
  }
  
  // API: Get current time
  else if (pathname === '/api/time' && method === 'GET') {
    sendJSON(res, 200, {
      success: true,
      data: {
        timestamp: Date.now(),
        date: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  }
  
  // Serve static files from public folder
  else if (pathname.startsWith('/public/')) {
    const filePath = path.join(__dirname, pathname);
    serveStaticFile(res, filePath);
  }
  
  // 404 Not Found
  else {
    sendHTML(res, 404, `
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 Not Found</title>
        <style>
          body { 
            font-family: Arial; 
            text-align: center; 
            padding: 50px;
            background: #f4f4f4;
          }
          h1 { font-size: 100px; margin: 0; color: #333; }
          p { font-size: 20px; color: #666; }
          a { color: #007bff; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>404</h1>
        <p>Page Not Found</p>
        <p><a href="/">← Go to Home</a></p>
      </body>
      </html>
    `);
  }
});

// Start server
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`\nAvailable routes:`);
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/about`);
  console.log(`  - http://localhost:${PORT}/api/users`);
  console.log(`  - http://localhost:${PORT}/api/time`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('   Try a different port or stop the other server\n');
  } else {
    console.error('Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed gracefully\n');
    process.exit(0);
  });
});