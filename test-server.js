#!/usr/bin/env node

// Simple mock server for testing scan functionality
const express = require('express');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Mock West Bengal products
const products = {
  P001: {
    productId: 'P001',
    name: 'Organic Gobindobhog Rice',
    variety: 'Gobindobhog (Aromatic)',
    farmerId: 'F001',
    plantingDate: '2024-06-15',
    harvestDate: '2024-11-20',
    quantity: '1200 kg',
    qualityGrade: 'Premium A',
    certifications: ['Organic', 'Traditional Variety'],
    location: 'Bardhaman, West Bengal',
    district: 'Bardhaman',
    state: 'West Bengal',
  },
  P002: {
    productId: 'P002',
    name: 'Fresh Bengali Tomatoes',
    variety: 'Pusa Ruby',
    farmerId: 'F002',
    plantingDate: '2024-08-01',
    harvestDate: '2024-12-15',
    quantity: '800 kg',
    qualityGrade: 'Grade A',
    certifications: ['GAP Certified', 'Pesticide Free'],
    location: 'Hooghly, West Bengal',
    district: 'Hooghly',
    state: 'West Bengal',
  },
  P003: {
    productId: 'P003',
    name: 'West Bengal Potatoes',
    variety: 'Kufri Jyoti',
    farmerId: 'F001',
    plantingDate: '2024-09-10',
    harvestDate: '2024-12-20',
    quantity: '2000 kg',
    qualityGrade: 'Premium A',
    certifications: ['Organic', 'Cold Storage Safe'],
    location: 'Bardhaman, West Bengal',
    district: 'Bardhaman',
    state: 'West Bengal',
  },
  P004: {
    productId: 'P004',
    name: 'Fresh Water Rohu Fish',
    variety: 'Rohu (Labeo rohita)',
    farmerId: 'F003',
    plantingDate: '2024-03-01',
    harvestDate: '2024-12-01',
    quantity: '500 kg',
    qualityGrade: 'Premium Fresh',
    certifications: ['Aquaculture Certified', 'Chemical Free'],
    location: 'North 24 Parganas, West Bengal',
    district: 'North 24 Parganas',
    state: 'West Bengal',
  },
  P005: {
    productId: 'P005',
    name: 'Bengali Brinjal',
    variety: 'Begun (Purple Long)',
    farmerId: 'F002',
    plantingDate: '2024-07-15',
    harvestDate: '2024-11-30',
    quantity: '600 kg',
    qualityGrade: 'Grade A',
    certifications: ['GAP Certified', 'Local Variety'],
    location: 'Hooghly, West Bengal',
    district: 'Hooghly',
    state: 'West Bengal',
  },
};

const farmers = {
  F001: {
    farmerId: 'F001',
    name: 'Subir Chatterjee',
    location: 'Bardhaman, West Bengal',
    crops: ['Rice', 'Potato', 'Jute'],
    farmSize: '12 hectares',
    certification: 'Organic Certified',
    contactInfo: '+91-98361-12345',
    village: 'Khirgaon',
    district: 'Bardhaman',
    state: 'West Bengal',
  },
  F002: {
    farmerId: 'F002',
    name: 'Mala Das',
    location: 'Hooghly, West Bengal',
    crops: ['Tomatoes', 'Brinjal', 'Cabbage', 'Cauliflower'],
    farmSize: '6 hectares',
    certification: 'GAP Certified',
    contactInfo: '+91-98302-67890',
    village: 'Chinsurah',
    district: 'Hooghly',
    state: 'West Bengal',
  },
  F003: {
    farmerId: 'F003',
    name: 'Ratan Mondal',
    location: 'North 24 Parganas, West Bengal',
    crops: ['Fish', 'Rice', 'Vegetables'],
    farmSize: '8 hectares',
    certification: 'Aquaculture Certified',
    contactInfo: '+91-98320-54321',
    village: 'Barasat',
    district: 'North 24 Parganas',
    state: 'West Bengal',
  },
};

// Mock supply chain events
const supplyChainEvents = {
  P002: [
    {
      productId: 'P002',
      stage: 'Farm',
      timestamp: '2024-12-15T07:00:00Z',
      location: 'Das Vegetable Farm, Chinsurah, Hooghly',
      actor: 'Mala Das',
      action: 'Harvested',
      temperature: '22°C',
      humidity: '70%',
      notes: 'Fresh Bengali tomatoes harvested at perfect ripeness',
    },
    {
      productId: 'P002',
      stage: 'Collection',
      timestamp: '2024-12-15T12:00:00Z',
      location: 'Hooghly Vegetable Collection Center',
      actor: 'Collection Agent Ravi Kar',
      action: 'Sorted & Graded',
      temperature: '20°C',
      humidity: '65%',
      notes: 'Sorted by size and quality, Grade A selected',
    },
    {
      productId: 'P002',
      stage: 'Transport',
      timestamp: '2024-12-16T06:00:00Z',
      location: 'Sealdah Wholesale Market, Kolkata',
      actor: 'Transporter Gopal Singh',
      action: 'Market Delivery',
      temperature: '18°C',
      humidity: '60%',
      notes:
        'Transported in ventilated trucks, delivered fresh to wholesale market',
    },
  ],
};

// API Routes
app.get('/api/trace/:productId', (req, res) => {
  const productId = req.params.productId;
  const product = products[productId];

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  const farmer = farmers[product.farmerId];
  const events = supplyChainEvents[productId] || [];

  res.json({
    success: true,
    trace: {
      product: product,
      farmer: farmer,
      supplyChain: events,
    },
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(products).length,
    products: Object.values(products),
  });
});

app.get('/api/farmers', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(farmers).length,
    farmers: Object.values(farmers),
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 AgriTrace Mock Server running at http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET /api/trace/:productId - Trace product journey`);
  console.log(`   - GET /api/products - List all products`);
  console.log(`   - GET /api/farmers - List all farmers`);
  console.log(`🧪 Testing Mode: Ready for scan functionality test`);
});
