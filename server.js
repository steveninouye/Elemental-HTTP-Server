const http = require('http');
const fs = require('fs');
const qstring = require('querystring');
let options = {};
let port = 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.write('<h1>hello</h1>');
  //   console.log(req.headers);
  //   console.log('path ', req.path);
});
server.on('request', (req, res) => {
  const { method, url } = req;
  //   console.log(req);
  console.log(method);
  console.log(url);
});

server.on('data', data => {
  //   console.log(data);
});
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
