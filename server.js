const http = require('http');
const fs = require('fs');
const qstring = require('querystring');

//define listening port
let port = 8080;

//read public directory files
let publicDirFiles;
fs.readdir('./public/', (err, files) => {
  publicDirFiles = files;
});

//create server
const server = http
  .createServer((req, res) => {})
  .on('request', (req, res) => {
    const { method, url } = req;
    if (method === 'POST') {
      console.log(req.headers);
      let body = '';
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', function() {
        console.log(qstring.parse(body));
      });
    }

    //define local file path
    let localFilePath;
    //set default status HTML status code to 200
    let HTMLStatusCode = 200;
    if (url === '/') {
      localFilePath = '/index.html';
    } else if (url === '/favicon.ico') {
      localFilePath = '/superman.png';
    } else if (
      publicDirFiles.indexOf(url.slice(1)) !== -1 ||
      url.slice(-4) === '.css'
    ) {
      localFilePath = url;
    } else {
      localFilePath = '/404.html';
      HTMLStatusCode = 404;
    }

    //define content type to input into response headers
    let contentType;
    if (localFilePath.slice(-5) === '.html') {
      contentType = 'text/html';
    } else if (localFilePath.slice(-4) === '.css') {
      contentType = 'text/css';
    } else if (localFilePath.slice(-4) === '.png') {
      contentType = 'image/x-icon';
    }

    //read file from local file path in public directory
    fs.readFile('./public' + localFilePath, function(err, data) {
      //write the headers
      res.writeHead(HTMLStatusCode, { 'Content-Type': contentType });
      res.write(data);
      res.end();
    });
  })
  .listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
