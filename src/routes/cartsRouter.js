// routes/cartsRouter.js
const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const cartId = generateId(); // Función para generar un ID único
    const newCart = {
      id: cartId,
      products: [],
    };

    await saveCartToFile(newCart);

    res.json({ message: 'Carrito creado correctamente', cartId });
  } catch (error) {
    console.error('Error al crear el carrito:', error.message);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await getCartById(cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error.message);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity) || 1;

    const cart = await getCartById(cartId);

    if (cart) {
      const existingProductIndex = cart.products.findIndex((p) => p.id === productId);

      if (existingProductIndex !== -1) {
        // Incrementar la cantidad si el producto ya existe en el carrito
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Agregar nuevo producto al carrito
        cart.products.push({ id: productId, quantity });
      }

      await saveCartToFile(cart);
      res.json({ message: `Producto con ID ${productId} agregado al carrito ${cartId}` });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error.message);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

// Funciones auxiliares para manejar los carritos en archivos
async function getCartById(cartId) {
  try {
    const cartData = await fs.readFile(`carrito.json`, 'utf8');
    const carts = JSON.parse(cartData);
    return carts.find((cart) => cart.id === cartId);
  } catch (error) {
    console.error('Error al obtener el carrito desde el archivo:', error.message);
    return null;
  }
}

async function saveCartToFile(cart) {
  try {
    const cartData = await fs.readFile('carrito.json', 'utf8');
    const carts = JSON.parse(cartData);
    const existingCartIndex = carts.findIndex((c) => c.id === cart.id);

    if (existingCartIndex !== -1) {
      // Actualizar el carrito si ya existe
      carts[existingCartIndex] = cart;
    } else {
      // Agregar nuevo carrito
      carts.push(cart);
    }

    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al escribir en el archivo de carritos:', error.message);
  }
}

module.exports = router;
