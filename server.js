const express = require('express');
const app = express();
const path = require('path');

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});
// Define a route to serve the HTML file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'index.html');
  res.sendFile(filePath);
});

app.use(express.static('./'));

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});