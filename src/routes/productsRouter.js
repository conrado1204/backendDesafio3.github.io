// routes/productsRouter.js
const express = require('express');
const ProductManager = require('../ProductManager');
const router = express.Router();

const productManager = new ProductManager('productos.txt');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el producto:', error.message);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProductData = req.body;
    await productManager.addProduct(newProductData);
    res.json({ message: 'Producto agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedData = req.body;
    await productManager.updateProduct(productId, updatedData);
    res.json({ message: `Producto con ID ${productId} actualizado correctamente` });
  } catch (error) {
    console.error('Error al actualizar el producto:', error.message);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar el producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
