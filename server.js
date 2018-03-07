const http = require('http');
const fs = require('fs');
const qstring = require('querystring');

//define listening port
let port = 8080;

//create server
const server = http
  .createServer((req, res) => {})
  .on('request', (req, res) => {
    //set default status HTML status code to 200
    let HTMLStatusCode = 200;
    let { method, url } = req;
    //read public directory files
    fs.readdir('./public/', (err, files) => {
      let publicDirFiles = files;
      fs.readdir('./public/elements/', (err, files) => {
        let elementsDirFiles = files;
        if (method === 'POST') {
          const elementPageTemplate = require('./elementPageTemplate');
          const indexPageTemplate = require('./indexPageTemplate');
          let body = '';
          req.on('data', function(data) {
            body += data;
          });
          req.on('end', function() {
            const {
              elementName,
              elementSymbol,
              elementAtomicNumber,
              elementDescription
            } = qstring.parse(body);
            const elementHTMLfile =
              elementPageTemplate[0] +
              capitalizeFirstLetter(elementName) +
              elementPageTemplate[1] +
              capitalizeFirstLetter(elementSymbol) +
              elementPageTemplate[2] +
              elementAtomicNumber +
              elementPageTemplate[3] +
              capitalizeFirstLetter(elementName) +
              elementPageTemplate[4] +
              capitalizeFirstLetter(elementSymbol) +
              elementPageTemplate[5] +
              elementAtomicNumber +
              elementPageTemplate[6] +
              capitalizeFirstLetter(elementDescription) +
              elementPageTemplate[7];
            const filename = `./public/elements/${elementName.toLowerCase()}.html`;
            fs.writeFile(filename, elementHTMLfile, function(err, file) {
              console.log(`${filename} written`);
              fs.readdir('./public/elements/', (err, files) => {
                elementsDirFiles = files;
                const elementDirCount = elementsDirFiles.length;
                const HTMLlistElements = elementsDirFiles.reduce((a, c) => {
                  return (
                    a +
                    `<li><a href="/${c}">${capitalizeFirstLetter(
                      c.slice(0, -5)
                    )}</a></li>`
                  );
                }, '');
                const indexHTMLfile =
                  indexPageTemplate[0] +
                  elementDirCount +
                  indexPageTemplate[1] +
                  HTMLlistElements +
                  indexPageTemplate[2];
                fs.writeFile('./public/index.html', indexHTMLfile, err => {
                  console.log('index.html written');
                });
                fs.readFile(
                  `./public/elements/${elementName.toLowerCase()}.html`,
                  function(err, data) {
                    //write the headers
                    res.writeHead(HTMLStatusCode, {
                      'Content-Type': 'text/html'
                    });
                    res.write(data);
                    res.end();
                  }
                );
              });
            });
          });
        } else if (method === 'GET') {
          //define local file path
          let localFilePath;
          if (url === '/') {
            localFilePath = '/index.html';
          } else if (url === '/favicon.ico') {
            localFilePath = '/images/superman.png';
          } else if (elementsDirFiles.indexOf(url.slice(1)) !== -1) {
            localFilePath = '/elements' + url;
          } else if (
            publicDirFiles.indexOf(url.slice(1)) !== -1 ||
            url.slice(-4) === '.css'
          ) {
            localFilePath = url;
            HTMLStatusCode = 200;
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
        }
      });
    });
  })
  .listen(port, () => {
    console.log(`server is running on port ${port}`);
  });

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
