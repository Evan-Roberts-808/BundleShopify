const dotenv = require('dotenv').config();
const {shopifyApp} = require('@shopify/shopify-app-express');
const express = require('express');

const port = 3000;
// const shopDomain; 

// App Initialization
const shopify = shopifyApp({
    api: {
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecretKey: process.env.SHOPIFY_API_SECRET,
        scopes: ['read_products'],
        hostScheme: 'http',
        hostName: `localhost:${port}`
    },
    auth: {
        path: '/api/auth',
        callbackPath: '/api/auth/callback',
    },
    webhooks: {
        path: '/api/webhooks',
    },
});

const app = express();

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot(),
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({webhookHandlers:{}}),
);

// Sample Route
app.get('/', shopify.ensureInstalledOnShop(), (req : any, res : any) => {
  res.send('Hello Bundlers!');
});

// get products will not work need more layers
app.get('/api/products', shopify.ensureInstalledOnShop(), async (req : any, res : any) => {
  try {
    const products = await shopify.product.list();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching products');
  }
})

// listen
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});