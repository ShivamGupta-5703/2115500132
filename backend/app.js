const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const VALID_COMPANIES = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const VALID_CATEGORIES = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad", "Bluetooth", "Pendrive", "Remote", "Speaker", "Headset", "Laptop", "PC"];

app.use(cors());
const getProducts = async (company, category, top, minPrice, maxPrice) => {
    const url = `http://20.244.56.144/test/companies/${company}/categories/${category}/products`;
    const params = {};
    if (top !== undefined) {
        params.top = parseInt(top, 10); // to int
    }
    if (minPrice !== undefined) {
        params.minPrice = parseFloat(minPrice);
    }
    if (maxPrice !== undefined) {
        params.maxPrice = parseFloat(maxPrice);
    }
    try {
        const response = await axios.get(url, {
            params,
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return [];
    }
};

const addUniqueIdentifiers = (products) => {
    return products.map(product => ({
        ...product,
        id: uuidv4(),
    }));
};

let productStore = {};
const validateParameters = (req, res, next) => {
    const { company, category } = req.params;
    if (!VALID_COMPANIES.includes(company) || !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Invalid company or category' });
    }
    next();
};
app.get('/companies/:company/categories/:category/products', validateParameters, async (req, res) => {
    const { company, category } = req.params;
    const { top, minPrice, maxPrice, sortBy, order } = req.query;
    const products = await getProducts(company, category, top, minPrice, maxPrice);
    const productsWithIds = addUniqueIdentifiers(products);
    productsWithIds.forEach(product => {
        productStore[product.id] = product;
    });
    let sortedProducts = productsWithIds;
    if (sortBy && order) {
        sortedProducts = productsWithIds.sort((a, b) => {
            if (sortBy === 'rating') {
                return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            } else if (sortBy === 'price') {
                return order === 'asc' ? a.price - b.price : b.price - a.price;
            } else if (sortBy === 'company') {
                return order === 'asc' ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
            } else if (sortBy === 'discount') {
                return order === 'asc' ? a.discount - b.discount : b.discount - a.discount;
            } else {
                return 0;
            }
        });
    }
    res.json(sortedProducts);
});
app.get('/products/:productid', (req, res) => {
    const { productid } = req.params;
    const product = productStore[productid];

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
