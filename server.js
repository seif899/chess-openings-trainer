const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const { DATABASE_URL } = process.env;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getData(res) {
  const client = await pool.connect();
  try {
    const data = await client.query('SELECT * FROM openings');
    res.json(data);
  } finally {
    client.release();
  }
}



app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin")
  next()
})

/*app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});*/
// Define a route to serve the HTML file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'index.html');
  res.sendFile(filePath);
});

app.get('/data', (req, res)=>{
  getData(res);
})

app.use(express.static('./'));

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});