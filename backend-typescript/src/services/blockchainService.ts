// services/blockchainService.ts

import { Web3 } from 'web3';
import { create as createIPFSClient } from 'ipfs-http-client';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

interface MetricData {
  athleteUuid: string;
  metricName: string;
  metric: any;
  timestamp: number;
}

interface BlockchainConfig {
  web3Provider: string;
  contractAddress: string;
  ipfsApiUrl: string;
}

export class BlockchainService {
  private web3: Web3;
  private ipfsClient: any;
  private contract: Contract;
  
  constructor(config: BlockchainConfig) {
    // Initialize Web3 with your provider (e.g., Infura)
    this.web3 = new Web3(config.web3Provider);
    
    // Initialize IPFS client
    this.ipfsClient = createIPFSClient({
      url: config.ipfsApiUrl
    });
    
    // Initialize smart contract instance
    this.contract = new this.web3.eth.Contract(
      PerformanceMetricABI as AbiItem[],
      config.contractAddress
    );
  }

  // Store metric data on IPFS and record hash on blockchain
  async storeMetricData(data: MetricData): Promise<string> {
    try {
      // Store data on IPFS
      const ipfsResult = await this.ipfsClient.add(JSON.stringify(data));
      const ipfsHash = ipfsResult.path;

      // Store IPFS hash on blockchain
      const account = await this.getAccount();
      const result = await this.contract.methods.storeMetricHash(
        data.athleteUuid,
        ipfsHash,
        data.timestamp
      ).send({ from: account });

      // Return the blockchain transaction hash
      return result.transactionHash;
    } catch (error) {
      throw new Error(`Failed to store metric data: ${error}`);
    }
  }

  // Retrieve metric data using blockchain hash
  async getMetricData(blockchainHash: string): Promise<MetricData> {
    try {
      // Get IPFS hash from blockchain
      const result = await this.contract.methods.getMetricHash(blockchainHash).call();
      const ipfsHash = result.ipfsHash;

      // Retrieve data from IPFS
      const ipfsData = await this.ipfsClient.cat(ipfsHash);
      let data = '';
      for await (const chunk of ipfsData) {
        data += chunk.toString();
      }

      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to retrieve metric data: ${error}`);
    }
  }

  private async getAccount(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }
}

// Smart Contract ABI
const PerformanceMetricABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "athleteUuid",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "storeMetricHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "blockchainHash",
        "type": "string"
      }
    ],
    "name": "getMetricHash",
    "outputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];