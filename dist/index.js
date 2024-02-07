"use strict";
var dotenv = require('dotenv').config();
var shopifyApp = require('@shopify/shopify-app-express').shopifyApp;
var express = require('express');
var port = 3000;
// const shopDomain; 
// App Initialization
var shopify = shopifyApp({
    api: {
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecretKey: process.env.SHOPIFY_API_SECRET,
        scopes: ['read_products'],
        hostScheme: 'http',
        hostName: "localhost:".concat(port)
    },
    auth: {
        path: '/api/auth',
        callbackPath: '/api/auth/callback',
    },
    webhooks: {
        path: '/api/webhooks',
    },
});
var app = express();
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(shopify.config.auth.callbackPath, shopify.auth.callback(), shopify.redirectToShopifyOrAppRoot());
app.post(shopify.config.webhooks.path, shopify.processWebhooks({ webhookHandlers: {} }));
// Sample Route
app.get('/', shopify.ensureInstalledOnShop(), function (req, res) {
    res.send('Hello world!');
});
// get products
// app.get('/api/products', shopify.ensureInstalledOnShop(), async (req : any, res : any) => {
//   try {
//     const products = await shopify.product.list();
//     res.json(products);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error fetching products');
//   }
// })
// listen
app.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
