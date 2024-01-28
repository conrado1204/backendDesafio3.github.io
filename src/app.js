// app.js
const express = require('express');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

const app = express();
const port = 8080;

app.use(express.json());

// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
