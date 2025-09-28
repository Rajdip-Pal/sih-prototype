# 🌾 AgroTrace - Agricultural Supply Chain Traceability

A blockchain-based agricultural supply chain traceability system that tracks products from farm to table.

## 🚀 Quick Start

### 1. Start the Blockchain Network
```bash
cd ../hard-hat
npm install
npm run node    # Starts local blockchain
npm run deploy  # Deploys BranchingBlockchain contract
```

### 2. Start the AgroTrace Backend
```bash
# In the backend directory
./start-agrotrace.sh
```

**Or manually:**
```bash
npm install
node server.js
```

## 🎮 Demo & Testing

### Interactive Demo
Visit: **http://localhost:3000/demo**

The demo page provides a user-friendly interface to:
- Trace products through the supply chain
- View farmer profiles
- Add supply chain events
- Generate QR codes
- View dashboard statistics

### API Endpoints

#### Farmers
- `GET /api/farmers` - List all farmers
- `GET /api/farmers/:farmerId` - Get specific farmer details

#### Products
- `GET /api/products` - List all products
- `GET /api/trace/:productId` - Complete product traceability
- `GET /api/blockchain-trace/:productId` - Blockchain-specific trace

#### Supply Chain
- `POST /api/supply-chain-event` - Add new supply chain event
- `GET /api/qr/:productId` - Generate QR code data for tracing

#### Dashboard
- `GET /api/dashboard/stats` - System statistics and metrics

#### Blockchain
- `GET /fullchain` - Complete blockchain data
- `POST /store` - Add block to blockchain
- `GET /chain/:startIndex` - Get chain from specific block

## 📊 Sample Data

The system comes pre-loaded with sample agricultural data:

### Farmers
- **F001**: Rajesh Kumar (Punjab) - Wheat, Rice, Corn
- **F002**: Priya Sharma (Karnataka) - Tomatoes, Carrots, Lettuce

### Products
- **P001**: Organic Cherry Tomatoes
- **P002**: Fresh Wheat Grain
- **P003**: Rainbow Carrots

### Supply Chain Stages
- Farm (Harvesting)
- Processing (Washing & Packaging)
- Distribution (Quality Check & Dispatch)
- Retail (Display)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the parent directory:
```env
RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key_here
PORT=3000
```

### Contract Configuration
The server expects these files in the `config/` directory:
- `BranchingBlockchain.abi.json` - Contract ABI
- `contract-address.json` - Deployed contract address

## 📱 Frontend Integration

### CORS Enabled
The server includes CORS headers for frontend integration.

### API Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Handling
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔍 Traceability Features

### Product Journey Tracking
- Farm origin and farmer details
- Processing and packaging information
- Distribution and logistics data
- Retail location and availability
- Temperature and humidity monitoring
- Quality certifications

### Blockchain Verification
- Immutable record storage
- Cryptographic proof of authenticity
- Timestamp verification
- Supply chain integrity

### QR Code Integration
Each product can generate QR codes that link to:
- Complete traceability information
- Farmer profiles
- Certification details
- Real-time location data

## 🛠️ Development

### Adding New Supply Chain Events
```javascript
const event = {
  productId: "P001",
  stage: "Processing",
  action: "Quality Inspection",
  location: "Processing Center A",
  actor: "Quality Team",
  temperature: "4°C",
  humidity: "70%",
  notes: "Passed all quality checks"
};

// POST to /api/supply-chain-event
```

### Custom Product Types
Extend the seed data in `server.js` to include new product categories:
- Grains & Cereals
- Fruits & Vegetables
- Dairy Products
- Meat & Poultry
- Processed Foods

## 📈 Monitoring & Analytics

### Dashboard Metrics
- Total farmers registered
- Products in system
- Supply chain events logged
- Organic vs conventional products
- Geographic distribution

### Blockchain Analytics
- Total blocks in chain
- Transaction history
- Block relationships (parent-child)
- Data integrity verification

## 🔐 Security Features

- Blockchain immutability
- Cryptographic signatures
- Audit trail preservation
- Access control ready
- Data validation

## 🚀 Production Deployment

### Environment Setup
1. Configure production blockchain network
2. Update RPC_URL in environment
3. Set production private keys
4. Configure HTTPS and domain
5. Set up database backup (optional)

### Scaling Considerations
- Load balancing for API endpoints
- Blockchain node redundancy
- Caching for frequently accessed data
- CDN for static assets

## 📞 Support

For questions or issues:
1. Check the interactive demo at `/demo`
2. Review API documentation at root URL
3. Examine blockchain data at `/fullchain`

---

**Made with 🌱 for sustainable agriculture and food security**
