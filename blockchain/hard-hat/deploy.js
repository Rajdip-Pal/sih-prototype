import fs from 'fs';
import path from 'path';
import hre from 'hardhat';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // console.log('Deploying with account:', deployer.address);

  const BranchingBlockchain = await hre.ethers.getContractFactory(
    'BranchingBlockchain'
  );
  const blockchain = await BranchingBlockchain.deploy();

  // ethers v6
  await blockchain.waitForDeployment();

  console.log(blockchain.target);

  // Save ABI + address into backend/config/
  const artifact = await hre.artifacts.readArtifact('BranchingBlockchain');

  const configDir = path.resolve(__dirname, '../backend/config');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  fs.writeFileSync(
    path.join(configDir, 'contract-address.json'),
    JSON.stringify({ contractAddress: blockchain.target }, null, 2)
  );

  fs.writeFileSync(
    path.join(configDir, 'BranchingBlockchain.abi.json'),
    JSON.stringify(artifact.abi, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
