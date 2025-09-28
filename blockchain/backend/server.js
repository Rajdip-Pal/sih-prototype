import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '../.env'), // load env from parent
});

const app = express();
app.use(express.json());

// CORS middleware for frontend integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files
app.use(express.static('public'));

const BigNumber = ethers.BigNumber; // ethers v5/v6 compatibility
function normalize(value) {
  if (typeof value === 'bigint') return value.toString(); // or Number(value) if safe
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalize(v)])
    );
  }
  return value;
}

// --------------------
// Helper: connect provider with retry
// --------------------
async function connectProvider(url, retries = 10, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getNetwork();
      console.log('Connected to provider at', url);
      return provider;
    } catch (err) {
      console.log(`Provider not ready, retrying... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Failed to connect to provider after multiple attempts');
}

// --------------------
// Connect to provider
// --------------------
// Support both local development and Docker networking
const BLOCKCHAIN_URL =
  process.env.BLOCKCHAIN_URL || process.env.RPC_URL || 'http://127.0.0.1:8545';
const provider = await connectProvider(BLOCKCHAIN_URL);

// --------------------
// Use wallet/signer
// --------------------
const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  : provider.getSigner(0);

// --------------------
// Load contract ABI & address
// --------------------
const abiPath = path.join(
  process.cwd(),
  'config',
  'BranchingBlockchain.abi.json'
);
const addressPath = path.join(process.cwd(), 'config', 'contract-address.json');

if (!fs.existsSync(abiPath) || !fs.existsSync(addressPath)) {
  throw new Error(
    '❌ Contract ABI or address not found. Did the deployer run?'
  );
}

const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const { contractAddress } = JSON.parse(fs.readFileSync(addressPath, 'utf8'));

const blockchain = new ethers.Contract(contractAddress, abi, wallet);

// --------------------
// Health check & Demo page
// --------------------
app.get('/', (_, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; text-align: center;">
      <h1>🌾 AgriTrace Backend API</h1>
      <p style="font-size: 1.2em; color: #666;">Agricultural Supply Chain Traceability System</p>
      <div style="margin: 30px 0;">
        <a href="/demo" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 1.1em;">
          🚀 View Interactive Demo
        </a>
      </div>
      <div style="text-align: left; background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3>📋 Available API Endpoints:</h3>
        <ul style="line-height: 2;">
          <li><strong>GET /api/farmers</strong> - List all farmers</li>
          <li><strong>GET /api/farmers/:farmerId</strong> - Get specific farmer</li>
          <li><strong>GET /api/products</strong> - List all products</li>
          <li><strong>GET /api/trace/:productId</strong> - Trace product journey</li>
          <li><strong>GET /api/blockchain-trace/:productId</strong> - Blockchain trace</li>
          <li><strong>POST /api/supply-chain-event</strong> - Add supply chain event</li>
          <li><strong>GET /api/dashboard/stats</strong> - Dashboard statistics</li>
          <li><strong>GET /api/qr/:productId</strong> - QR code data</li>
          <li><strong>GET /fullchain</strong> - Full blockchain data</li>
        </ul>
      </div>
    </div>
  `);
});

// Demo page route
app.get('/demo', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'demo.html'));
});

// --------------------
// Add a block
// --------------------
// --------------------
// Add a block
// --------------------
app.post('/store', async (req, res) => {
  try {
    const { parentIndex, data } = req.body;

    if (parentIndex === undefined) {
      return res.status(400).json({ error: 'Parent index required' });
    }

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Convert data to string for storage
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);

    // Send transaction to contract
    const tx = await blockchain.addBlock(parentIndex, stringData);

    // ethers v6: wait for deployment transaction to be mined
    await tx.wait();

    // Fetch latest block index safely
    let latestIndex;
    try {
      const index = await blockchain.getLatestBlockIndex();
      latestIndex = index?.toString() ?? null;
    } catch {
      latestIndex = null;
    }

    res.json({
      message: 'Block stored successfully',
      txHash: tx.hash,
      latestIndex,
      parentIndex,
      storedData: data,
    });
  } catch (err) {
    console.error('Error storing block:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Retrieve full chain
// --------------------
// --------------------
// Retrieve full chain
// --------------------
// --------------------
// Retrieve full chain with debug
// --------------------
// --------------------
// Retrieve full chain
// --------------------
app.get('/fullchain', async (_, res) => {
  try {
    const latestIndexBN = await blockchain.getLatestBlockIndex();
    const latestIndex = BigNumber?.isBigNumber(latestIndexBN)
      ? latestIndexBN.toNumber()
      : latestIndexBN?.toString
      ? parseInt(latestIndexBN.toString())
      : latestIndexBN;

    console.log(
      'Latest index bn : ',
      latestIndexBN,
      '\n',
      'Latest index : ',
      latestIndex
    );

    const blocks = [];

    for (let i = 0; i <= latestIndex; i++) {
      const blockData = await blockchain.getBlock(i);

      // Safe destructure for ethers v6 tuples
      const timestamp = blockData[0] ?? blockData.timestamp.toString();
      const data = blockData[1] ?? blockData.data;
      const parentIndex = blockData[2] ?? blockData.parentIndex.toString();
      const children = blockData[3] ?? blockData.children ?? [];

      console.log('Block data of block ', `${i} : `, blockData);

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = data;
      }

      const mappedChildren = Array.isArray(children)
        ? children.map((c) =>
            BigNumber?.isBigNumber(c)
              ? c.toNumber()
              : typeof c === 'string' && !isNaN(parseInt(c))
              ? parseInt(c)
              : c
          )
        : [...children].map((c) => {
            console.log('object');
            return BigNumber?.isBigNumber(c)
              ? c.toNumber()
              : typeof c === 'string' && !isNaN(parseInt(c))
              ? parseInt(c)
              : c;
          });

      console.log('mapped children : ', mappedChildren);

      blocks.push({
        index: i,
        timestamp: timestamp?.toString() ?? null,
        data: parsedData,
        parentIndex: parentIndex?.toString() ?? null,
        children: mappedChildren,
      });
    }

    res.status(200).json({
      message: 'success',
      blocks: normalize(blocks),
    });
  } catch (err) {
    console.error('Error fetching full chain:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Retrieve chain from a given block back to genesis
// --------------------
// --------------------
// Retrieve chain from a given block back to genesis (uint256.max as sentinel)
// --------------------
app.get('/chain/:startIndex', async (req, res) => {
  try {
    let startIndex = parseInt(req.params.startIndex);
    if (isNaN(startIndex)) {
      return res.status(400).json({ error: 'Invalid start index' });
    }

    const blocks = [];
    let currentIndex = startIndex;

    // uint256.max in decimal string
    const UINT256_MAX = ethers.MaxUint256.toString();

    while (currentIndex !== null && currentIndex >= 0) {
      const blockData = await blockchain.getBlock(currentIndex);

      // Safe destructure for ethers v6 tuples
      const timestamp = blockData[0] ?? blockData.timestamp?.toString();
      const data = blockData[1] ?? blockData.data;
      const parentIndexRaw =
        blockData[2] !== undefined
          ? blockData[2]
          : blockData.parentIndex ?? null;
      const children = blockData[3] ?? blockData.children ?? [];

      let parentIndex =
        parentIndexRaw !== null
          ? BigNumber?.isBigNumber(parentIndexRaw)
            ? parentIndexRaw.toString()
            : parentIndexRaw.toString()
          : null;

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = data;
      }

      const mappedChildren = Array.isArray(children)
        ? children.map((c) =>
            BigNumber?.isBigNumber(c)
              ? c.toNumber()
              : typeof c === 'string' && !isNaN(parseInt(c))
              ? parseInt(c)
              : c
          )
        : [...children].map((c) =>
            BigNumber?.isBigNumber(c)
              ? c.toNumber()
              : typeof c === 'string' && !isNaN(parseInt(c))
              ? parseInt(c)
              : c
          );

      blocks.push({
        index: currentIndex,
        timestamp: timestamp?.toString() ?? null,
        data: parsedData,
        parentIndex,
        children: mappedChildren,
      });

      // Stop if this is genesis (parent = uint256.max)
      if (parentIndex === UINT256_MAX) break;

      // Otherwise continue up the chain
      currentIndex = parentIndex !== null ? parseInt(parentIndex) : null;
    }

    res.status(200).json({
      message: 'success',
      chain: normalize(blocks),
    });
  } catch (err) {
    console.error('Error fetching lineage chain:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Agricultural Seed Data & Demo APIs
// --------------------

// Sample agricultural data for West Bengal stakeholders
const SEED_DATA = {
  farmers: [
    {
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
    {
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
    {
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
  ],
  products: [
    {
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
    {
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
    {
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
    {
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
    {
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
  ],
  supplyChain: [
    // Gobindobhog Rice journey
    {
      productId: 'P001',
      stage: 'Farm',
      timestamp: '2024-11-20T06:00:00Z',
      location: 'Chatterjee Organic Farm, Khirgaon, Bardhaman',
      actor: 'Subir Chatterjee',
      action: 'Harvested',
      temperature: '28°C',
      humidity: '75%',
      notes: 'Premium Gobindobhog rice harvested during optimal maturity',
    },
    {
      productId: 'P001',
      stage: 'Processing',
      timestamp: '2024-11-21T10:00:00Z',
      location: 'Bardhaman Rice Mill, West Bengal',
      actor: 'Mill Supervisor Amit Roy',
      action: 'Cleaned & Milled',
      temperature: '25°C',
      humidity: '60%',
      notes: 'Traditional milling process, maintaining aromatic quality',
    },
    {
      productId: 'P001',
      stage: 'Quality Check',
      timestamp: '2024-11-21T15:00:00Z',
      location: 'WB Agricultural Testing Lab, Bardhaman',
      actor: 'Quality Inspector Nilima Sen',
      action: 'Quality Certified',
      temperature: '24°C',
      humidity: '55%',
      notes: 'Certified organic, moisture content 12%, zero pesticide residue',
    },
    {
      productId: 'P001',
      stage: 'Distribution',
      timestamp: '2024-11-22T08:00:00Z',
      location: 'Bengal Fresh Distribution Hub, Kolkata',
      actor: 'Distributor Pradip Ghosh',
      action: 'Packaged & Dispatched',
      temperature: '26°C',
      humidity: '65%',
      notes: 'Packaged in eco-friendly jute bags, dispatched to retail outlets',
    },

    // Bengali Tomatoes journey
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

    // Rohu Fish journey
    {
      productId: 'P004',
      stage: 'Aquaculture',
      timestamp: '2024-12-01T05:00:00Z',
      location: 'Mondal Fish Farm, Barasat, North 24 Parganas',
      actor: 'Ratan Mondal',
      action: 'Harvested from Pond',
      temperature: '24°C',
      humidity: '85%',
      notes: 'Fresh water Rohu fish harvested from organic pond culture',
    },
    {
      productId: 'P004',
      stage: 'Processing',
      timestamp: '2024-12-01T08:00:00Z',
      location: 'Barasat Fish Processing Unit',
      actor: 'Processing Team Led by Dipak Majumdar',
      action: 'Cleaned & Iced',
      temperature: '2°C',
      humidity: '95%',
      notes: 'Fish cleaned, scaled and preserved in ice for freshness',
    },
    {
      productId: 'P004',
      stage: 'Distribution',
      timestamp: '2024-12-01T14:00:00Z',
      location: 'Shyambazar Fish Market, Kolkata',
      actor: 'Fish Trader Bijoy Das',
      action: 'Market Supply',
      temperature: '4°C',
      humidity: '90%',
      notes: 'Delivered to traditional fish market maintaining cold chain',
    },
  ],
};

// Initialize seed data when server starts
async function loadSeedData() {
  try {
    console.log('🌱 Loading agricultural seed data...');
    console.log('📦 Seed data already exists, skipping loading');
    return;

    // Check if we already have seed data by looking for farmer profiles
    const latestIndex = await blockchain.getLatestBlockIndex();
    let hasSeededData = false;

    // Check existing blocks for seed data
    if (latestIndex > 0) {
      for (let i = 0; i <= latestIndex; i++) {
        try {
          const blockData = await blockchain.getBlock(i);
          const data = blockData[1];
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'farmer_profile' || parsedData.farmerId) {
            hasSeededData = true;
            break;
          }
        } catch (e) {
          // Skip blocks that aren't JSON or don't have our data structure
        }
      }
    }

    if (hasSeededData) {
      console.log('📦 Seed data already exists, skipping loading');
      console.log(
        `📊 Current blockchain has ${Number(latestIndex) + 1} blocks`
      );
      return;
    }

    console.log('🚀 Loading fresh seed data...');

    // Add delay between transactions to avoid nonce issues
    const addBlockWithDelay = async (parentIndex, data, delay = 500) => {
      const tx = await blockchain.addBlock(parentIndex, JSON.stringify(data));
      await tx.wait();
      await new Promise((resolve) => setTimeout(resolve, delay));
      return tx;
    };

    // Load farmer profiles
    for (const farmer of SEED_DATA.farmers) {
      await addBlockWithDelay(0, {
        type: 'farmer_profile',
        ...farmer,
      });
      console.log(`👨‍🌾 Added farmer: ${farmer.name}`);
    }

    // Load product information
    for (const product of SEED_DATA.products) {
      await addBlockWithDelay(0, {
        type: 'product_info',
        ...product,
      });
      console.log(`🥕 Added product: ${product.name}`);
    }

    // Load supply chain events
    for (const event of SEED_DATA.supplyChain) {
      await addBlockWithDelay(0, {
        type: 'supply_chain_event',
        ...event,
      });
      console.log(
        `📦 Added supply chain event: ${event.action} for ${event.productId}`
      );
    }

    console.log('✅ Seed data loaded successfully!');
    const finalIndex = await blockchain.getLatestBlockIndex();
    console.log(`📊 Blockchain now has ${Number(finalIndex) + 1} total blocks`);
  } catch (error) {
    console.error('❌ Error loading seed data:', error.message);
    console.log(
      '⚠️  Server will continue running with existing blockchain data'
    );
  }
}

// --------------------
// Agricultural APIs
// --------------------

// Get all farmers
app.get('/api/farmers', async (req, res) => {
  try {
    const farmers = SEED_DATA.farmers;
    res.json({
      success: true,
      count: farmers.length,
      farmers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get farmer by ID
app.get('/api/farmers/:farmerId', async (req, res) => {
  try {
    const farmer = SEED_DATA.farmers.find(
      (f) => f.farmerId === req.params.farmerId
    );
    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, error: 'Farmer not found' });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = SEED_DATA.products;
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product trace by ID
app.get('/api/trace/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Get product info
    const product = SEED_DATA.products.find((p) => p.productId === productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Product not found' });
    }

    // Get farmer info
    const farmer = SEED_DATA.farmers.find(
      (f) => f.farmerId === product.farmerId
    );

    // Get supply chain events
    const supplyChainEvents = SEED_DATA.supplyChain
      .filter((event) => event.productId === productId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json({
      success: true,
      trace: {
        product,
        farmer,
        supplyChain: supplyChainEvents,
        totalStages: supplyChainEvents.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get blockchain trace for product
app.get('/api/blockchain-trace/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Get all blocks from blockchain
    const latestIndex = await blockchain.getLatestBlockIndex();
    const blocks = [];

    for (let i = 0; i <= latestIndex; i++) {
      const blockData = await blockchain.getBlock(i);
      const data = blockData[1];

      try {
        const parsedData = JSON.parse(data);
        if (
          parsedData.productId === productId ||
          (parsedData.type === 'product_info' &&
            parsedData.productId === productId) ||
          (parsedData.type === 'supply_chain_event' &&
            parsedData.productId === productId)
        ) {
          blocks.push({
            blockIndex: i,
            timestamp: blockData[0].toString(),
            data: parsedData,
            parentIndex: blockData[2].toString(),
          });
        }
      } catch (error) {
        // Skip non-JSON blocks or blocks without relevant data
      }
    }

    res.json({
      success: true,
      productId,
      blockchainTrace: blocks.sort(
        (a, b) => parseInt(a.blockIndex) - parseInt(b.blockIndex)
      ),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new supply chain event
app.post('/api/supply-chain-event', async (req, res) => {
  try {
    const event = {
      ...req.body,
      timestamp: new Date().toISOString(),
    };

    // Add to blockchain
    const tx = await blockchain.addBlock(
      0,
      JSON.stringify({
        type: 'supply_chain_event',
        ...event,
      })
    );
    await tx.wait();

    res.json({
      success: true,
      message: 'Supply chain event added successfully',
      txHash: tx.hash,
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = {
      totalFarmers: SEED_DATA.farmers.length,
      totalProducts: SEED_DATA.products.length,
      totalSupplyChainEvents: SEED_DATA.supplyChain.length,
      organicProducts: SEED_DATA.products.filter((p) =>
        p.certifications.includes('Organic')
      ).length,
      recentEvents: SEED_DATA.supplyChain
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5),
      productsByLocation: SEED_DATA.products.reduce((acc, product) => {
        acc[product.location] = (acc[product.location] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// QR Code generation endpoint (for demo)
app.get('/api/qr/:productId', (req, res) => {
  const productId = req.params.productId;
  const traceUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/trace/${productId}`;

  res.json({
    success: true,
    productId,
    qrData: traceUrl,
    message: 'Scan this QR code to trace the product',
  });
});

// --------------------
// Start server with seed data
// --------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`🚀 AgriTrace Server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`🔍 API Endpoints:`);
  console.log(`   - GET /api/farmers - List all farmers`);
  console.log(`   - GET /api/products - List all products`);
  console.log(`   - GET /api/trace/:productId - Trace product journey`);
  console.log(`   - GET /api/blockchain-trace/:productId - Blockchain trace`);
  console.log(`   - POST /api/supply-chain-event - Add new event`);
  console.log(`   - GET /api/qr/:productId - Generate QR code data`);

  // Load seed data after server starts
  setTimeout(() => {
    loadSeedData().catch(console.error);
  }, 2000); // Wait 2 seconds for blockchain to be ready
});
