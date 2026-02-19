const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Serve index.html for the root path
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } 
    // Handle other potential requests (favicon, etc.)
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`------------------------------------------------`);
    console.log(`  NEXUS OS Server Running`);
    console.log(`  Open your browser and go to: http://localhost:${PORT}`);
    console.log(`  Press Ctrl+C to stop the server`);
    console.log(`------------------------------------------------`);
});
