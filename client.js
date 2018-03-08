const net = require('net');

const method = 'DELETE';
const uri = '/delete';
const HTTPVersion = 'HTTP/1.1';
const date = new Date().toUTCString();
const port = 8080;
let headers = {};
const serverConnection = setTimeout(function() {
  console.log(`Could not connect to port ${port}\n`);
  process.exit();
}, 5000);
const server = net
  .createConnection(port, socket => {
    clearTimeout(serverConnection);
    console.log(`Connected to on port ${port}`);
    server.write(
      `${method} ${uri} ${HTTPVersion}\r\nUser-Agent: Steven\r\nConnection: close\r\nAccept: text/html, application/json\r\nDate: ${date}\r\n\r\n`
    );

    server.on('data', data => {
      //   let dataArray = data.toString().split('\n\n');
      //   const responseHeader = dataArray[0].split('\n');
      //   const statusLine = responseHeader[0].split(' ');
      //   headers.HTTP_Version = statusLine[0];
      //   headers.Status_Code = statusLine[1];
      //   headers.Reason = statusLine[2];
      //   responseHeader.forEach((e, i) => {
      //     if (i !== 0) {
      //       const headerKey = e.split(': ')[0];
      //       const headerValue = e.split(': ')[1];
      //       headers[headerKey] = headerValue;
      //     }
      //   });
      //   dataArray.splice(0, 2);
      //   let doc = dataArray.join('');
      //   process.stdout.write(data.toString());
      //   server.end();
    });

    server.on('end', () => {
      process.exit();
    });
  })
  .on('error', e => {
    process.stdout.write(`Could not connect to port ${port}\n`);
  });
