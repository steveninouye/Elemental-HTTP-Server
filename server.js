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
    console.log(method);
    //read public directory files
    fs.readdir('./public/', (err, files) => {
      let publicDirFiles = files;
      fs.readdir('./public/elements/', (err, files) => {
        let elementsDirFiles = files;
        if (method === 'POST' || method === 'DELETE' || method === 'PUT') {
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
            const indexPageTemplate = require('./indexPageTemplate');
            const rewriteIndexHTMLfile = HTMLfilePath => {
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
                fs.readFile(HTMLfilePath, function(err, data) {
                  //write the headers
                  res.writeHead(HTMLStatusCode, {
                    'Content-Type': 'text/html'
                  });
                  res.write(data);
                  res.end();
                });
              });
            };

            if (method === 'DELETE') {
              const filePathAndName = `./public/elements/${elementName.toLowerCase()}.html`;
              fs.unlink(filePathAndName, err => {
                console.log(`deleted ${filePathAndName}`);
                rewriteIndexHTMLfile('./public/index.html');
              });
            } else if (url === '/put' || method === 'PUT') {
              if (
                elementName &&
                elementSymbol &&
                elementAtomicNumber &&
                elementDescription
              ) {
                //edit file
              } else {
                //respond with If the requested path to update does not exist, return a 500 server error, content type application/json, and content body of { "error" : "resource /carbon.html does not exist" } (for example)
              }
            } else if (elementName && elementSymbol && elementAtomicNumber) {
              const elementPageTemplate = require('./elementPageTemplate');
              const elementHTMLfile =
                elementPageTemplate[0] +
                capitalizeFirstLetter(elementName) +
                elementPageTemplate[1] +
                capitalizeFirstLetter(elementName) +
                elementPageTemplate[2] +
                capitalizeFirstLetter(elementSymbol) +
                elementPageTemplate[3] +
                elementAtomicNumber +
                elementPageTemplate[4] +
                capitalizeFirstLetter(elementName) +
                elementPageTemplate[5] +
                capitalizeFirstLetter(elementSymbol) +
                elementPageTemplate[6] +
                elementAtomicNumber +
                elementPageTemplate[7] +
                capitalizeFirstLetter(elementDescription) +
                elementPageTemplate[8] +
                elementName.toLowerCase() +
                elementPageTemplate[9];
              const filename = `./public/elements/${elementName.toLowerCase()}.html`;
              fs.writeFile(filename, elementHTMLfile, function(err, file) {
                console.log(`${filename} written`);
                rewriteIndexHTMLfile(
                  `./public/elements/${elementName.toLowerCase()}.html`
                );
              });
            } else {
              //render 404.html
              console.log('notworking');
            }
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
            url.slice(-4) === '.css' ||
            url.slice(-3) === '.js'
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
          } else if (localFilePath.slice(-3) === '.js') {
            contentType = 'application/javascript';
          }

          //read file from local file path in public directory
          fs.readFile('./public' + localFilePath, function(err, data) {
            //write the headers
            res.writeHead(HTMLStatusCode, { 'Content-Type': contentType });
            res.write(data);
            res.end();
          });
        } else {
          fs.readFile('./public/404.html', function(err, data) {
            //write the headers
            res.writeHead(404, { 'Content-Type': 'text/html' });
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
