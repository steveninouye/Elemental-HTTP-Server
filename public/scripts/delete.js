function deleteElement(element) {
  const net = require('net');

  const method = 'DELETE';
  const uri = '/delete';
  const HTTPVersion = 'HTTP/1.1';
  const date = new Date().toUTCString();
  const port = 8080;

  let elementName = element;
  let elementSymbol = '';
  let elementAtomicNumber = 1;
  let elementDescription = 'test';

  const serverConnection = setTimeout(function() {
    console.log(`Could not connect to port ${port}\n`);
    process.exit();
  }, 5000);
  const server = net
    .createConnection(port, socket => {
      clearTimeout(serverConnection);
      console.log(`Connected to on port ${port}`);
      server.write(
        `${method} ${uri} ${HTTPVersion}\nContent-Length: 50\n\nelementName=${elementName}&elementSymbol=${elementSymbol}&elementAtomicNumber=${elementAtomicNumber}&elementDescription=${elementDescription}`
      );

      server.on('data', data => {
        console.log(data.toString());
      });

      server.on('end', () => {
        process.exit();
      });
    })
    .on('error', e => {
      process.stdout.write(`Could not connect to port ${port}\n`);
    });
}
