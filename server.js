const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// You can pass the parameter in the command line. e.g., node server.js 3000
const port = process.argv[2] || 9000;

// Path to the data file
const dataFilePath = path.join(__dirname, 'todos.json');

// Initialize the data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
}

// Maps file extension to MIME types
// Full list can be found here: https://www.freeformatter.com/mime-types-list.html
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'application/x-font-ttf',
};

// Helper function to send JSON responses
const sendJsonResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Helper function to parse request body
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Limit the body size to prevent abuse
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        if (body) {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } else {
          resolve({});
        }
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
};

// Create HTTP server
http.createServer(async (req, res) => {
  console.log(`Received ${req.method} request for ${req.url}`);

  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle API routes
  if (pathname.startsWith('/api/todos')) {
    let todosData;
    try {
      todosData = fs.readFileSync(dataFilePath, 'utf8');
    } catch (err) {
      console.error('Error reading todos.json:', err);
      sendJsonResponse(res, 500, { message: 'Internal Server Error' });
      return;
    }

    let todos = [];
    try {
      todos = JSON.parse(todosData);
    } catch (err) {
      console.error('Error parsing todos.json:', err);
      sendJsonResponse(res, 500, { message: 'Internal Server Error' });
      return;
    }

    // Extract the ID if present (e.g., /api/todos/123)
    const idMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
    const todoId = idMatch ? parseInt(idMatch[1], 10) : null;

    if (req.method === 'GET') {
      if (todoId !== null) {
        // Get a single todo by ID
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
          console.log(`Found Todo ID ${todoId}:`, todo);
          sendJsonResponse(res, 200, todo);
        } else {
          console.warn(`Todo ID ${todoId} not found.`);
          sendJsonResponse(res, 404, { message: 'Todo not found' });
        }
      } else {
        // Get all todos
        console.log('Returning all todos.');
        sendJsonResponse(res, 200, todos);
      }
    } else if (req.method === 'POST') {
      if (pathname === '/api/todos/reset') {
        // Reset Todos (for testing)
        todos = [];
        try {
          fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
          console.log('Todos have been reset.');
          sendJsonResponse(res, 200, { message: 'Todos reset successfully' });
        } catch (err) {
          console.error('Error resetting todos:', err);
          sendJsonResponse(res, 500, { message: 'Internal Server Error' });
        }
      } else {
        // Create a new todo
        try {
          const newTodo = await parseRequestBody(req);
          if (!newTodo.text) {
            throw new Error('Todo text is required');
          }
          newTodo.id = Date.now();
          newTodo.completed = false;
          newTodo.createdDate = new Date().toISOString();
          todos.push(newTodo);
          fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
          console.log(`Added new todo: ${newTodo.text} with ID ${newTodo.id}`);
          sendJsonResponse(res, 201, newTodo);
        } catch (err) {
          console.error('Error adding todo:', err.message);
          sendJsonResponse(res, 400, { message: err.message });
        }
      }
    } else if (req.method === 'PUT') {
      if (todoId !== null) {
        // Update an existing todo
        try {
          const updatedFields = await parseRequestBody(req);
          const index = todos.findIndex(t => t.id === todoId);
          if (index !== -1) {
            todos[index] = { ...todos[index], ...updatedFields };
            fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
            console.log(`Updated todo with ID ${todoId}:`, todos[index]);
            sendJsonResponse(res, 200, todos[index]);
          } else {
            console.warn(`Attempted to update non-existent Todo ID ${todoId}.`);
            sendJsonResponse(res, 404, { message: 'Todo not found' });
          }
        } catch (err) {
          console.error('Error updating todo:', err.message);
          sendJsonResponse(res, 400, { message: err.message });
        }
      } else {
        console.warn('PUT request missing Todo ID.');
        sendJsonResponse(res, 400, { message: 'Todo ID is required for updating' });
      }
    } else if (req.method === 'DELETE') {
      if (todoId !== null) {
        // Delete a todo
        const index = todos.findIndex(t => t.id === todoId);
        if (index !== -1) {
          const deletedTodo = todos.splice(index, 1)[0];
          try {
            fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
            console.log(`Deleted todo with ID ${todoId}:`, deletedTodo);
            sendJsonResponse(res, 200, deletedTodo);
          } catch (err) {
            console.error('Error deleting todo:', err);
            sendJsonResponse(res, 500, { message: 'Internal Server Error' });
          }
        } else {
          console.warn(`Attempted to delete non-existent Todo ID ${todoId}.`);
          sendJsonResponse(res, 404, { message: 'Todo not found' });
        }
      } else {
        console.warn('DELETE request missing Todo ID.');
        sendJsonResponse(res, 400, { message: 'Todo ID is required for deletion' });
      }
    } else {
      // Method not allowed
      console.warn(`Method ${req.method} not allowed on /api/todos.`);
      sendJsonResponse(res, 405, { message: 'Method Not Allowed' });
    }
    return;
  }

  // Handle static file serving
  // Avoid directory traversal attacks
  const sanitizePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, sanitizePath);

  // If the path is a directory, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file is not found, return 404
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`File ${filePath} not found!`);
      console.warn(`File not found: ${filePath}`);
      return;
    }

    // Read the file from the file system
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Error getting the file: ${err}.`);
        console.error(`Error reading file ${filePath}:`, err);
      } else {
        // Based on the URL path, extract the file extension. e.g., .js, .doc, ...
        const ext = path.parse(filePath).ext;
        // If the file is found, set Content-type and send data
        res.setHeader('Content-Type', mimeType[ext] || 'text/plain');
        res.end(data);
        console.log(`Served file: ${filePath}`);
      }
    });
  });

}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);
