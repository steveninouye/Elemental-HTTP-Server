module.exports = [
  `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <title>The Elements - `,
  `</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  
  <body>
    <h1>`,
  `</h1>
    <h2>`,
  `</h2>
    <h3>Atomic number `,
  `</h3>
    <p>`,
  ` is a chemical element with chemical symbol `,
  ` and atomic number `,
  `. `,
  `</p>
    <p>
      <a href="/">Back</a>
      <a href="/put">Edit</a>
      <form action="/delete" method="POST">
        <input type="hidden" name="elementName" id="elementName" value="`,
  `">
        <input type="submit" value="Delete"> </form>
    </p>
  </body>
  
  </html>`
];
