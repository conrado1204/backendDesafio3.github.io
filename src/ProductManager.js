// ProductManager.js
const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(this.path);
    } catch (err) {
      await this.saveProductsToFile([]);
    }
  }

  async addProduct(productData) {
    const products = await this.getProductsFromFile();
    const newProduct = {
      id: await this.getNextProductId(products),
      ...productData,
    };
    products.push(newProduct);
    await this.saveProductsToFile(products);
    console.log('Producto agregado:', newProduct);
  }

  async getProducts() {
    return await this.getProductsFromFile();
  }

  async getProductById(id) {
    const products = await this.getProductsFromFile();
    const product = products.find((p) => p.id === id);
    if (!product) {
      console.log('Producto no encontrado.');
    } else {
      console.log('Producto encontrado:', product);
    }
    return product;
  }

  async updateProduct(id, updatedData) {
    const products = await this.getProductsFromFile();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData, id };
      await this.saveProductsToFile(products);
      console.log(`Producto con ID ${id} actualizado.`);
      console.log('Producto actualizado:', products[index]);
    } else {
      console.log('Producto no encontrado.');
    }
  }

  async deleteProduct(id) {
    const products = await this.getProductsFromFile();
    const updatedProducts = products.filter((p) => p.id !== id);
    if (products.length !== updatedProducts.length) {
      await this.saveProductsToFile(updatedProducts);
      console.log(`Producto con ID ${id} eliminado.`);
    } else {
      console.log('Producto no encontrado.');
    }
  }

  async getNextProductId(products) {
    return products.length === 0 ? 1 : Math.max(...products.map((p) => p.id)) + 1;
  }

  async getProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error.message);
      return [];
    }
  }

  async saveProductsToFile(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al escribir en el archivo:', error.message);
    }
  }
}

module.exports = ProductManager;
